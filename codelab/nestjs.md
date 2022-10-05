id:nestjs

# De la Terre à la Lune (et au-delà) avec NestJS

## Récupération du projet et installation des outils
Duration: 5:30

Prérequis :

- [Git](https://git-scm.com/)
- [Node / npm](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/) (ou tout autre IDE JS)


Installer [Nest CLI](https://docs.nestjs.com/cli/overview) :

```bash
npm install -g @nestjs/cli
```

Vérifier le bon fonctionnement :

```bash
nest -v
```

Récupérer le code du projet :

```bash
git clone https://github.com/chawax/nestjs-codelab.git
```

Installer les dépendances npm :

```bash
cd nestjs-codelab
npm i
```

## Première API
Duration: 10:00

Pour commencer, nous allons créer une première API très simple et exposer sa documentation via Swagger.

La première route de notre API consiste à donner l'état de santé de notre application.

Créons le module `health` :

```bash
nest g module health
```

Créons le controller `health` :

```bash
nest g controller health
```

Dans le fichier `src\health\health.controller.ts` du controller, rajoutons la méthode `check` qui répondra au requête de type `GET` :

```ts
@Get()
check(): string {
    return 'Everything is OK';
}
```

L'IDE nous aide à rajouter les import de librairies nécessaires.

Vérifions que tout fonctionne :

```bash
npm run start:dev
```

La route `health` est accessible dans un navigateur via [http://localhost:3000/health](http://localhost:3000/health).

Nous allons maitenant activer le versionning d'API et la documentation Swagger.

Dans `src\main.ts`, rajoutons la configuration nécessaire :

```ts
  // VERSIONNING
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //-------- SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Form Earth to Moon API')
    .setDescription('A codelab to discover NestJs and more')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```

Modifions `HealthController` pour rajouter un numéro de version sur son API :

```ts
@Controller({ path: '/health', version: '1' })
```

L'URL de la route `health` est maintenant [http://localhost:3000/v1/health](http://localhost:3000/v1/health).

L'interface Swagger est accessible via [http://localhost:3000/api](http://localhost:3000/api). Nous pouvons y tester notre API.

## Ressources Planet et Starship
Duration: 20:00

Nous allons maintenant créer une API pour la gestion de planètes.
Pour ce faire, nous allons créer des classes [controller](https://docs.nestjs.com/controllers), [service](https://docs.nestjs.com/providers#services), DTO et entity et placer le tout dans un module dédié.

Tout cela peut être préparé avec la commande suivante :

```bash
nest g resource planet
```

Choisissons `REST API` dans la liste proposée de couches de transport. Nous activons également la génération des points d'entrée CRUD.


Dans la classe entity `src\planet\entities\planet.entity.ts`, ajoutons les propriétés d'une planète :

```ts
name: string;

distanceToEarth: number;
```

Dans la class service `src\planet\planet.service.ts`, modifions la méthode `findAll()` pour renvoyer des données en dur :
```ts
findAll(): Planet[] {
    const planetsJSON = [
      {
        name: 'Lune',
        distanceToEarth: 384400,
      },
      {
        name: 'Venus',
        distanceToEarth: 41400000,
      },
      {
        name: 'Mars',
        distanceToEarth: 78340000,
      },
      {
        name: 'Mercure',
        distanceToEarth: 91690000,
      },
      {
        name: 'Jupiter',
        distanceToEarth: 628730000,
      },
      {
        name: 'Saturne',
        distanceToEarth: 1275000000,
      },
      {
        name: 'Uranus',
        distanceToEarth: 2723950000,
      },
      {
        name: 'Neptune',
        distanceToEarth: 4351400000,
      },
    ];

    const planets: Planet[] = Object.assign(new Array<Planet>(), planetsJSON);

    return planets;
  }
```

Nous pouvons tester la route qui liste toutes les planètes via Swagger ou via son URL : [http://localhost:3000/planet](http://localhost:3000/planet).

Faisons maintenant de même pour la ressource `starship` :

```bash
nest g resource starship
```

Ajoutons les proprietés d'un `starship` :

```ts
name: string;

speed: number;

kilometerPrice: number;
```

Modifions la méthode `findAll()` de l'entité `starship` pour renvoyer des données en dur :
```ts
findAll(): Starship[] {
    const starshipsJSON = [
      {
        name: 'Apollo',
        speed: 39000,
        kilometerPrice: 10000,
      },
      {
        name: 'SpaceX Starship',
        speed: 27000,
        kilometerPrice: 250000,
      },
      {
        name: 'Sonde Parker',
        speed: 532000,
        kilometerPrice: 50000,
      },
    ];

    const starships: Starship[] = Object.assign(new Array<Starship>(), starshipsJSON);

    return starships;
  }
```

De même que pour `planet`, la route qui liste tous les vaisseaux peut être testée via Swagger ou via son URL : [http://localhost:3000/starship](http://localhost:3000/starship).

## TypeORM
Duration: 10:00

Nous allons maintenant activer l'ORM TypeORM pour lire des données dans une base de données [SQLite](https://www.sqlite.org/).

Sur les classes entity, nous rajoutons l'annotation `@Entity()` pour indiquer à TypeORM de faire le mapping avec une table de la base de données.

Pour `planet` :

```ts
@Entity({ name: 'planet' })
```

Pour `starship` :

```ts
@Entity({ name: 'starship' })
```

Puis sur chaque propriété de ces 2 classes, nous rajoutons l'annotation `@Column()` pour faire le mapping avec les colonnes des tables concernées. Ex :

```ts
@Column()
name: string;
```

Créeons ensuite, dans `src\utils\default-entity.ts`, la classe `DefaultEntity` qui contient les propriétés communes à toutes les entités de notre application, à savoir :
- `id` : un identifiant technique généré automatiquement par incrément
- `uuid` : un identifiant métier unique au format UUID et généré automatiquement
- `active` : un booléen indiquant si la ressource est active

Le code de la classe `DefaultEntity` est le suivant :
```ts
import { Exclude } from "class-transformer";
import { Column, Generated, PrimaryGeneratedColumn } from "typeorm";

export class DefaultEntity {
    @Exclude()
    @PrimaryGeneratedColumn('identity')
    id: number;
    
    @Column()
    active: boolean;

    @Column({ unique: true })
    @Generated("uuid")
    uuid: string;    
}
```

Enfin, faisons hériter `Planet` et `Starship` de `DefaultEntity` :

```ts
export class Planet extends DefaultEntity {
```

```ts
export class Starship extends DefaultEntity {
```

Maintenant, créeons un fichier .env à la racine du projet et ajoutons y la référence à la base de données à laquelle nous souhaitons accéder :

```
SQL_MEMORY_DB_SHARED=./db/planet-starship.sqlite
```

Dans `src\app.module.ts`, dans la section `imports`, ajoutons le chargement du module TypeORM et de la base de donnée indiquée dans le fichier de configuration :
```ts
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: configService.get('SQL_MEMORY_DB_SHARED'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
    }),
    PlanetModule,
    StarshipModule,
    BookingModule,
  ],
```

Dans `src\planet\planet.module.ts`, ajoutons l'import de TypeORM pour l'entité `Planet` et l'export du service `PlanetService` :
```ts
  imports: [TypeOrmModule.forFeature([Planet])],
  exports: [PlanetService],
```

Faisons de même pour le module starship dans `src\starship\starship.module.ts` :
```ts
  imports: [TypeOrmModule.forFeature([Starship])],
  exports: [StarshipService],
```

Dans le service `PlanetService`, ajoutons un constructeur qui injecte le repository `Planet` :
```ts
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>,
  ) {}
```

Puis modifions la méthode `findAll()` pour utiliser le repository qui va exécuter la requête de récupération des objet `Planet` sur la base de données. la signature de la méthode est modifiée pour renvoyer un objet `Promise<Planet[]>` :
```ts
  findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }
```

Faisons de même pour le service `StarshipService` :
```ts
  constructor(
    @InjectRepository(Starship)
    private readonly starshipRepository: Repository<Starship>,
  ) {}
```

```ts
  findAll(): Promise<Starship[]> {
    return this.starshipRepository.find();
  }
```

Les données `planet` et `starship` sont mainteanant récupérées depuis la base de données. On peut le tester avec [http://localhost:3000/planet](http://localhost:3000/planet) et [http://localhost:3000/starship](http://localhost:3000/starship).

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

