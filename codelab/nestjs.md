id:nestjs

# De la Terre à la Lune (et au-delà) avec NestJS

## Step 1 - ODA
Duration: 5:30

Instructions pour installer le projet et vérifier que tout fonctionne.

```bash
git clone https://github.com/chawax/nestjs-codelab.git
```

## Step 2 - ODA
Duration: 10:00

Un premier contrôleur de type `health` :
- Utilisation du CLI Nest
- Initialisation de Swagger
- Utilisation des versions

## Step 3 - ODA
Duration: 20:00

Un deuxième contrôleur plus évolué :
- Utilisation du CLI pour créer une nouvelle ressource `planet` 
- Puis on enrichit le contrôleur de récupération des planètes
- Création dans un premier temps d'une liste "mockée"

La même chose pour la ressource `starship`.

## Step 4 - ODA
Duration: 10:00

Intégration de TypeORM pour les ressources `planet` et `starship`

En lecture dans un premier temps

## Step 5 - ODA
Duration: 10:00

Ecriture en base

Objets DTO pour la création / modification avec utilisation de `PartialType` pour `starship` et `planet`

## Création de la ressource `Booking`

Dans cette étape nous allons créer une nouvelle ressource : `booking` :

```bash
nest g resource booking
```

Modifions l'entité `Booking` pour qu'elle hérite de `DefaultEntity` :

```ts
export class Booking extends DefaultEntity {
```

Et ajoutons le mapping pour les propriétés suivantes.

```ts
@ManyToOne(() => Planet)
destination: Planet;

@ManyToOne(() => Starship)
starship: Starship;

@Column()
traveller: string;

@Column()
departureDate: Date;

arrivalDate: Date;
```

Le décorateur `@ManyToOne` permet de créer un lien entre l'entité `Booking` et les entités `Planet` et `Starship`. Notons que la propriété `arrivalDate` ne correspond pas à une colonne mais sera calculée (voir plus bas).

Ajoutons également les propriétés `travelTime` et `price`. Ces propriétés sont calculées après le chargement d'une entité `Booking`.

```
@AfterLoad()
travelTime() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice && this.starship?.speed) {
        const travelTime = this.destination.distanceToEarth / (this.starship.speed * 24);
        this.arrivalDate = new Date(dayjs(this.departureDate).add(travelTime, 'day').toISOString());
        return travelTime;
    }
}

@AfterLoad()
price() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice) {
        return this.destination.distanceToEarth * this.starship.kilometerPrice;
    }
}
```

Créer une nouvelle classe `CreateBookingDto` avec les propriétés suivantes. Elle sera utilisée pour décrire l'entrée nécessaire au service de création d'une réservation.

```ts
@ApiProperty()
@Expose()
@IsBoolean()
active: boolean;

@ApiProperty()
@Expose()
@IsUUID()
destinationUuid: string;

@ApiProperty()
@Expose()
@IsUUID()
starshipUuid: string;

@ApiProperty()
@Expose()
@IsString()
traveller: string;

@ApiProperty()
@Expose()
@IsDate()
departureDate: Date;
```

Créer également une classe `UpdateBookingDto` qui définira l'entrée nécessaire pour modifier une réservation. L'utilisation de `PartialType`, importé de `@nestjs/swagger` permet d'indiquer qu'on a les mêmes propriétés que `CreateBookingDto` mais qu'elles sont optionnelles.

```ts
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @IsUUID()
    @IsOptional()
    uuid: string;
}
```

Enrichir le service `BookingService`. Injections d'abord les dépendances nécessaires dans le constructeur.

```ts
constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly planetService: PlanetService,
    private readonly starshipService: StarshipService,
) { }
```

Compléter la méthode de création d'une réservation. Elle crée une instance de l'entité `Booking`, la complète avec les données issues du DTO et appelle le repository pour sauvegarder l'entité. On fait également aux services `planetService` et `starshipService` pour récupérer les entités correspondant aux uuids fournis dans le DTO.


```ts
async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const destination = await this.planetService.findOneByUuid(createBookingDto.destinationUuid);
    const starship = await this.starshipService.findOneByUuid(createBookingDto.starshipUuid);

    if (!destination || !starship) {
        throw new UnprocessableEntityException('Both destination and starship should contains existing uuids');
    }

    const booking: Booking = new Booking();
    booking.active = createBookingDto.active;
    booking.departureDate = createBookingDto.departureDate;
    booking.traveller = createBookingDto.traveller;
    booking.destination = destination;
    booking.starship = starship;

    return this.bookingRepository.save(booking);
}
```

Faire de même pour la méthode `update`. 

```ts
async update(uuid: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOneByUuid(uuid);

    if (!booking) {
      throw new NotFoundException();
    }

    if (updateBookingDto.destinationUuid) {
      const destination = await this.planetService.findOneByUuid(updateBookingDto.destinationUuid);
      if (!destination) {
        throw new UnprocessableEntityException('The provided destination UUID doesn\'t map to an existing destination');
      }
      booking.destination = destination;
    }

    if (updateBookingDto.starshipUuid) {
      const starship = await this.starshipService.findOneByUuid(updateBookingDto.starshipUuid);
      if (!starship) {
        throw new UnprocessableEntityException('The provided starship UUID doesn\'t map to an existing starship');
      }
      booking.starship = starship;
    }

    booking.active = updateBookingDto.active;
    booking.departureDate = updateBookingDto.departureDate;
    booking.traveller = updateBookingDto.traveller;

    return this.bookingRepository.save(booking);
}
```

Compléter les méthodes `remove` et `findAll`, et ajouter une méthode `findOneByUuid`. La propriété `relations` permet de charger le vaisseau et la planète de destination quand on charge une réservation.

```ts
remove(uuid: string): Promise<DeleteResult> {
    return this.bookingRepository.delete({ uuid });
}

findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['starship', 'destination'] });
}
```

Et ajouter la méthode `findOneByUuid` :

```ts
findOneByUuid(uuid: string): Promise<Booking> {
    return this.bookingRepository.findOne({ where: { uuid }, relations: ['starship', 'destination'] });
}
```

Et enfin compléter le contrôleur `BookingController`

```ts
@Post()
create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
}

@Patch(':uuid')
update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateBookingDto: UpdateBookingDto,
): Promise<Booking> {
    return this.bookingService.update(uuid, updateBookingDto);
}

@Delete(':uuid')
remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.bookingService.remove(uuid);
}

@Get()
findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
}

@Get(':uuid')
findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Booking> {
    return this.bookingService.findOneByUuid(uuid);
}
```

## Sécurisation des contrôleurs
Duration: 10:00

Nous allons sécuriser l'accès à nos endoints en exigeant la fourniture d'un bearer d'authentification dans les headers des requêtes. Nous allons créer un "guard", un composant NestJS qui permet de contrôler l'accès à des routes.

Dans le fichier `.env` ajouter la variable d'environnement `API_BEARER` qui définit la valeur attendue pour le bearer :

```
API_BEARER=MyBearer
```

Créer un nouveau module `security` :

```bash
nest g module security
```

Créer un guard dans ce module :

```bash
nest g guard security/bearer
```

Compléter le code du guard comme ci-dessous :

```ts
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class BearerGuard implements CanActivate {
  private readonly logger = new Logger(BearerGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request?.headers?.authorization === `Bearer ${this.configService.get<string>('API_BEARER')}`) {
      return true;
    }

    this.logger.warn(`An unauthorized call has been made on a API endpoint`);
    return false;
  }
}
```

Quelques explications :
- L'interface `CanActivate` permet d'activer ou non une route en fonction du résultat de la méthode `canActivate`
- On contrôle la présence d'un header `authorization` avec comme valeur attendue celle saisie dans le fichier `.env`, récupérée grâce au service `ConfigService.

Activons maintenant ce guard pour l'ensemble des routes de l'application en ajoutant les lignes suivantes dans le fichier `main.ts` : 

```ts
app.useGlobalGuards(new BearerGuard(configService));
```

Nous devons maintenant configurer Swagger pour activer la saisie du header `authorization` dans Swagger UI.

Toujours dans le fichier `main.ts` modifier la configuration de Swagger en faisant appel à la méthode `addBearerAuth`.

```ts
const config = new DocumentBuilder()
    .setTitle('Form Earth to Moon API')
    .setDescription('A codelab to discover NestJs and more')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
```

Enfin sur chacun des contrôleurs ajouter le décorateur `@ApiBearerAuth` importé de Swagger. Par exemple dans `BookingController` :

```ts
@ApiTags('bookings')
@ApiBearerAuth()
@Controller({ path: '/bookings', version: '1' })
export class BookingController {
```

Il ne reste plus qu'à lancer Swagger UI. Tester les services sans bearer et se rendre compte qu'on a une erreur 403. Puis cliquer sur le bouton `Authenticate`, saisir la valeur du bearer (juste la valeur de la clé) et tester les services, ils doivent désormais passer.

## Step 8 - OTH
Duration: 10:00

Gestion de la configuration

