id:nestjs

# De la Terre à la Lune (et au-delà) avec NestJS

## Récupération du projet et installation des outils
Duration: 5:00

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
Duration: 20:00

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

Dans le fichier `src\health\health.controller.ts` du controller, rajoutons la méthode `check` qui répondra aux requêtes de type `GET` :

```ts
@Get()
check(): string {
    return 'Everything is OK';
}
```

La complétion dans l'IDE nous aide à rajouter les imports de librairies nécessaires, mais au cas où voici les imports à ajouter :

```ts
import { Controller, Get } from '@nestjs/common';
```

Vérifions que tout fonctionne en lançant l'application en mode développement (live reload) :

```bash
npm run start:dev
```

La route `health` est accessible dans un navigateur via [http://localhost:3000/health](http://localhost:3000/health).

Nous allons maitenant activer le versionning d'API et la documentation Swagger.

Dans `src\main.ts`, rajoutons la configuration nécessaire dans la fonction `bootstrap`. Attention : l'instruction `app.listen` doit rester la dernière instruction de la fonction.

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

Les imports à utiliser sont les suivants :

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
```

Modifions `HealthController` pour rajouter un numéro de version sur son API :

```ts
@Controller({ path: '/health', version: '1' })
```

L'URL de la route `health` est maintenant [http://localhost:3000/v1/health](http://localhost:3000/v1/health).

L'interface Swagger est accessible via [http://localhost:3000/api](http://localhost:3000/api). Nous pouvons y tester notre API.

## Ressources Planet et Starship
Duration: 10:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step2" pour débuter cette étape : <code>git checkout -f step2</code></aside>

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
Duration: 20:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step3" pour débuter cette étape : <code>git checkout -f step3</code></aside>

Nous allons maintenant activer l'ORM [TypeORM](https://typeorm.io/) pour lire des données dans une base de données [SQLite](https://www.sqlite.org/). Une base SQLite contenant déjà des données est incluse dans le repository cloné.

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

Les imports dans ces entités sont les suivants :

```ts
import { Column, Entity } from 'typeorm';
```

Créons ensuite, dans `src\utils\default-entity.ts`, la classe `DefaultEntity` qui contient les propriétés communes à toutes les entités de notre application, à savoir :
- `id` : un identifiant technique généré automatiquement par incrément
- `uuid` : un identifiant métier unique au format UUID et généré automatiquement
- `active` : un booléen indiquant si la ressource est active

Le code de la classe `DefaultEntity` est le suivant :

```ts
// src/utils/default-entity.ts

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

Maintenant, créons un fichier .env à la racine du projet et ajoutons y la référence à la base de données à laquelle nous souhaitons accéder :

```
SQL_MEMORY_DB_SHARED=./db/planet-starship.sqlite
```

Dans `src\app.module.ts`, dans la section `imports`, ajoutons le chargement du module TypeORM et de la base de données indiquée dans le fichier de configuration :
```ts
  imports: [
    HealthModule,
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
  ],
```

Avec les imports suivants :

```ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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

Avec les imports suivants :

```ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
```

Puis modifions la méthode `findAll()` pour utiliser le repository qui va exécuter la requête de récupération des objets `Planet` sur la base de données. La signature de la méthode est modifiée pour renvoyer un objet `Promise<Planet[]>` :
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

Les données `planet` et `starship` sont maintenant récupérées depuis la base de données. On peut le tester avec [http://localhost:3000/planet](http://localhost:3000/planet) et [http://localhost:3000/starship](http://localhost:3000/starship).

<aside class="negative">Il faut redémarrer l'application pour que les modifications des variables d'environnement soient prises en compte.</aside>

## CRUD Planet et Starship
Duration: 25:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step4" pour débuter cette étape : <code>git checkout -f step4</code></aside>

Nous allons maintenant rajouter les opérations de récupération unitaire et d'écriture en base de données.

Modifions `src\planet\dto\create-planet.dto.ts` pour rajouter les propriétés utiles à la création d'une planète. On y ajoute des annotations utiles à l'exposition Swagger et à la validation des données :

```ts
  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  distanceToEarth: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;
```

Avec les imports suivants :

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
```

`UpdatePlanetDto` hérite partiellement de `CreatePlanetDto` en rajoutant les propriétés nécessaires à la mise à jour :

```ts
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  uuid: string;
```

Avec les imports suivants :

```ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
```

Procédons de même pour `CreateStarshipDto`  :

```ts
  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  speed: number;
  
  @ApiProperty()
  @Expose()
  @IsNumber()
  kilometerPrice: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;
```

Et pour `UpdateStarshipDto` :

```ts
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  uuid: string;
```

Pour que les annotations soient actives, nous devons ajouter la configuration suivante dans la méthode `bootstrap` de  `src\main.ts` :

```ts
  //------- IN & OUT
  // Enables global behaviors on incoming DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only exposed attributes will be accepted on incoming DTO
      transform: true, // Automatically converts attributes from incoming DTO when possible
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Enables global behaviors on outgoing entities
  // For examples, @Exclude decorators will be processed
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```

Avec les imports suivants :

```ts
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
```

Modifions `PlanetService` pour utiliser les DTO et le repository.

Commençons par la méthode `create()`. Le type de retour est modifié pour correspondre au type de retour de la méthode `save()` du repository :
```ts
  create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetRepository.save(createPlanetDto);
  }
```

Remplaçons la méthode `findOne()` pour une méthode `findOneByUuid()` qui recherche une planète en fonction de son UUID :
```ts
  findOneByUuid(uuid: string): Promise<Planet | null> {
    return this.planetRepository.findOneBy({ uuid });
  }
```

La méthode `update()` est modifiée pour prendre en entrée un UUID plutôt qu'un id. Elle renvoie un objet de type `Promise<Planet>` :
```ts
  async update(uuid: string, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    await this.planetRepository.save({ id: planet.id, ...updatePlanetDto });

    return this.findOneByUuid(uuid);
  }
```

Idem pour la méthode `remove()` :
```ts
  async remove(uuid: string): Promise<DeleteResult> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    return this.planetRepository.delete({ uuid });
  }
```

Avec les imports suivants :

```ts
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
```

La classe `PlanetController` doit être modifiée pour prendre en compte nos modifications sur `PlanetService` et pour utiliser des UUID :
```ts
  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Planet> {
    const planet = await this.planetService.findOneByUuid(uuid);

    if (planet) {
      return planet;
    }

    throw new NotFoundException();
  }
```

```ts
  @Patch(':uuid')
  update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    return this.planetService.update(uuid, updatePlanetDto);
  }
```

```ts
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.planetService.remove(uuid);
  }
```

Enfin modifions les annotations de la classe pour versionner l'API et améliorer la lisibilité dans Swagger :
```ts
  @ApiTags('planets')
  @Controller({ path: '/planets', version: '1' })
  export class PlanetController {
```

Les imports à utiliser sont les suivants :

```ts
import { Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
```

Procédons de même pour `StarshipService` :

```ts
  create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    return this.starshipRepository.save(createStarshipDto);
  }
```

```ts
  findOneByUuid(uuid: string): Promise<Starship | null> {
    return this.starshipRepository.findOneBy({ uuid });
  }
```

```ts
  async update(uuid: string, updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    const starship = await this.findOneByUuid(uuid);

    if (!starship) {
      throw new NotFoundException();
    }

    await this.starshipRepository.save({ id: starship.id, ...updateStarshipDto });

    return this.findOneByUuid(uuid);
  }
```

```ts
  async remove(uuid: string): Promise<DeleteResult> {
    const starship = await this.findOneByUuid(uuid);

    if (!starship) {
      throw new NotFoundException();
    }

    return this.starshipRepository.delete({ uuid });
  }
```

Et pour `StarshipController` :

```ts
  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Starship> {
    return this.starshipService.findOneByUuid(uuid);
  }
```

```ts
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateStarshipDto: UpdateStarshipDto,
  ): Promise<Starship> {
    return this.starshipService.update(uuid, updateStarshipDto);
  }
```

```ts
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.starshipService.remove(uuid);
  }
```

```ts
@ApiTags('starships')
@Controller({ path: '/starships', version: '1' })
export class StarshipController {
```

Nous pouvons maintenant utiliser toutes les opérations CRUD sur Planet et Starship via Swagger.

Créons des planètes via la route `POST` `/v1/planets` :

```json
{
  "name": "Mercure",
  "distanceToEarth": 91690000,
  "active": true
}
```

```json
{
  "name": "Jupiter",
  "distanceToEarth": 628730000,
  "active": true
}
```

```json
{
  "name": "Saturne",
  "distanceToEarth": 1275000000,
  "active": true
}
```

```json
{
  "name": "Uranus",
  "distanceToEarth": 2723950000,
  "active": true
}
```

```json
{
  "name": "Neptune",
  "distanceToEarth": 4351400000,
  "active": true
}
```

Créons un starship via la route `POST` `/v1/starships` :

```json
{
  "name": "SpaceX Starship",
  "speed": 27000,
  "kilometerPrice": 250000,
  "active": true
}
```

## Création de la ressource `Booking`
Duration: 15:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step5" pour débuter cette étape : <code>git checkout -f step5</code></aside>

Dans cette étape nous allons créer une nouvelle ressource : `booking` :

```bash
nest g resource booking
```

Dans `BookingModule`, ajoutons l'import des modules nécessaires :
```ts
imports: [PlanetModule, StarshipModule, TypeOrmModule.forFeature([Booking])],
```

Modifions l'entité `Booking` pour qu'elle hérite de `DefaultEntity` et déclarons la comme une entité avec mapping vers la table `booking` :

```ts
@Entity({ name: 'booking' })
export class Booking extends DefaultEntity {
```

Et ajoutons le mapping pour les propriétés suivantes :

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

price: number;
```

Le décorateur `@ManyToOne` permet de créer un lien entre l'entité `Booking` et les entités `Planet` et `Starship`. Notons que les propriétés `arrivalDate` et `price` ne correspondent pas à des colonnes mais seront calculées (voir plus bas).

Ajoutons également les méthodes `processTravelTime()` et `processPrice()`. Elles sont appelées après le chargement d'une entité `Booking` et permettent d'alimenter les propriétés `arrivalDate` et `price`.

```ts
  @AfterLoad()
  processTravelTime() {
    if (this.destination?.distanceToEarth && this.starship?.speed) {
      const travelTime = this.destination.distanceToEarth / (this.starship.speed * 24);
      this.arrivalDate = new Date(dayjs(this.departureDate).add(travelTime, 'day').toISOString());
    }
  }

  @AfterLoad()
  processPrice() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice) {
      this.price = this.destination.distanceToEarth * this.starship.kilometerPrice;
    }
  }
```

Attention à l'import de `dayjs` : 
```ts
import * as dayjs from 'dayjs';
```

Modifions la classe `CreateBookingDto` en rajoutant les propriétés ci-après. Elle sera utilisée pour décrire l'entrée nécessaire au service de création d'une réservation.

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

Modifions également la classe `UpdateBookingDto` qui définira l'entrée nécessaire pour modifier une réservation. L'utilisation de `PartialType`, importé de `@nestjs/swagger` permet d'indiquer qu'on a les mêmes propriétés que `CreateBookingDto` mais qu'elles sont optionnelles.

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

Enrichir le service `BookingService`. Injectons d'abord les dépendances nécessaires dans le constructeur.

```ts
constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly planetService: PlanetService,
    private readonly starshipService: StarshipService,
) { }
```

Modifions la méthode de création d'une réservation. Elle crée une instance de l'entité `Booking`, la complète avec les données issues du DTO et appelle le repository pour sauvegarder l'entité. On fait également appel aux services `planetService` et `starshipService` pour récupérer les entités correspondant aux uuids fournis dans le DTO.


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

Remplaçons la méthode `findOne` par une méthode `findOneByUuid` pour prendre en compte un UUID. La propriété `relations` permet de charger le vaisseau et la planète de destination quand on charge une réservation.

```ts
  findOneByUuid(uuid: string): Promise<Booking> {
    return this.bookingRepository.findOne({ where: { uuid }, relations: ['starship', 'destination'] });
  }
```

De même que pour `create()`, la méthode `update` est modifiée :

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

Compléter les méthodes `remove` et `findAll` :

```ts
remove(uuid: string): Promise<DeleteResult> {
    return this.bookingRepository.delete({ uuid });
}
```

```ts
findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['starship', 'destination'] });
}
```

Et enfin compléter le contrôleur `BookingController` :

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

```ts
@ApiTags('bookings')
@Controller({ path: '/bookings', version: '1' })
```

Il est maintenant possible de manipuler les bookings avec leur API dans Swagger.

## Sécurisation des contrôleurs
Duration: 10:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step6" pour débuter cette étape : <code>git checkout -f step6</code></aside>

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
- On contrôle la présence d'un header `authorization` avec comme valeur attendue celle saisie dans le fichier `.env`, récupérée grâce au service `ConfigService`.

Activons maintenant ce guard pour l'ensemble des routes de l'application en ajoutant les lignes suivantes dans le fichier `main.ts` : 

```ts
  const configService = app.get<ConfigService>(ConfigService);

  // SECURITY
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

Il ne reste plus qu'à lancer Swagger UI. Tester les services sans bearer : on a une erreur 403. Puis cliquer sur le bouton `Authenticate`, saisir la valeur du bearer (juste la valeur de la clé) et tester les services, ils doivent désormais passer.

## Gestion de la configuration
Duration: 10:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step7" pour débuter cette étape : <code>git checkout -f step7</code></aside>

Nous allons maintenant améliorer la gestion de configuration en bloquant le démarrage de l'application si des variables d'environnement ne sont pas correctes et en évitant l'accès direct aux variables d'environnement depuis les composants de l'application.

Créons le fichier `config/configuration.ts` qui va définir le mapping entre nos clés de configuration et des variables d'environnement :

```ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    path: process.env.SQL_MEMORY_DB_SHARED,
  },
  security: {
    apiBearer: process.env.API_BEARER,
  },
});
```

Créons un schéma de validation pour cette configuration dans le fichier `config/schema.ts` en utilisant la librairie `Joi` :

```ts
import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  SQL_MEMORY_DB_SHARED: Joi.string().required(),
  API_BEARER: Joi.string().required(),
});
```

Modifions la configuration du module `ConfigModule` dans `app.module.ts`

```ts
  ConfigModule.forRoot({
    load: [configuration],
    validationSchema: configurationSchema,
    validationOptions: {
      abortEarly: true,
    },
  }),
```

Avec les imports suivants :

```ts
import configuration from './config/configuration';
import configurationSchema from './config/schema';
```

Modifions le paramétrage du port d'écoute de l'application dans `main.ts`:

```ts
await app.listen(configService.get('port'));
```

Ainsi que la clé permettant de récupérer path de la base de données, toujours dans `app.module.ts` :

```ts
database: configService.get('database.path'),
```

Enfin modifions la clé de récupération du bearer d'authentification dans `bearer.guard.ts` :

```ts
if (request?.headers?.authorization === `Bearer ${this.configService.get<string>('security.apiBearer')}`) {
```

Mettons en commentaire la variable d'environnement `API_BEARER` dans le fichier `.env` et démarrons le serveur avec `npm run start:dev` : on doit avoir un message d'erreur indiquant le nom de la variable manquante.

Décommentons la variable et relançons `npm run start:dev` : l'application démarre bien sur le port `3000` et les services fonctionnent correctement.

Ajoutons maintenant un paramètre `PORT` avec la valeur `8080` dans le fichier `.env` et relançons `npm run start:dev` : l'application démarre désormais sur le port `8080`.

## Tests
Duration: 30:00

<aside>Si vous n'avez pas eu le temps de finir l'étape précédente, vous pouvez faire un checkout de la branche "step8" pour débuter cette étape : <code>git checkout -f step8</code></aside>

Nous allons maintenant rajouter des tests au projet.

Lors de la création des artefacts via la CLI, Nest crée des fichiers de tests. Ceux-ci ont une extension `.spec.ts`.

Lançons les tests qui ont été générés de manière automatique :
```bash
npm run test
```
On peut constater que les tests échouent.

En effet, dans les tests créés par défaut, il faut compléter l'injection de dépendance en paramétrant les providers nécessaires à la bonne exécution des tests.
Par exemple dans `booking.controller.spec.ts`, la configuration générée de base est la suivante :

```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [BookingController],
    providers: [BookingService],
  }).compile();

  controller = module.get<BookingController>(BookingController);
});
```

Il est nécessaire de modifier le code de la manière suivante :

```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [BookingController],
    providers: [
      BookingService,
      PlanetService,
      StarshipService,
      {
        provide: getRepositoryToken(Booking),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(Planet),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(Starship),
        useClass: Repository,
      },
    ],
  }).compile();

  controller = module.get<BookingController>(BookingController);
});
```

De même configurons l'injection de dépendances pour `booking.service.spec.ts` :
```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BookingService,
      PlanetService,
      StarshipService,
      {
        provide: getRepositoryToken(Booking),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(Planet),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(Starship),
        useClass: Repository,
      },
    ],
  }).compile();

  service = module.get<BookingService>(BookingService);
});
```

Pour `planet.controller.spec.ts` :
```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [PlanetController],
    providers: [
      PlanetService,
      {
        provide: getRepositoryToken(Planet),
        useClass: Repository,
      },
    ],
  }).compile();

  controller = module.get<PlanetController>(PlanetController);
});
```

Pour `planet.service.spec.ts` :
```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PlanetService,
      {
        provide: getRepositoryToken(Planet),
        useClass: Repository,
      },
    ],
  }).compile();

  service = module.get<PlanetService>(PlanetService);
});
```

Pour `starship.controller.spec.ts` :
```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [StarshipController],
    providers: [
      StarshipService,
      {
        provide: getRepositoryToken(Starship),
        useClass: Repository,
      },
    ],
  }).compile();

  controller = module.get<StarshipController>(StarshipController);
});
```

Pour `starship.service.spec.ts` :
```ts
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      StarshipService,
      {
        provide: getRepositoryToken(Starship),
        useClass: Repository,
      },
    ],
  }).compile();

  service = module.get<StarshipService>(StarshipService);
});
```

Dans `bearer.guard.spec.ts`, pour l'instant mettons en commentaire le test :
```ts
it('should be defined', () => {
  //expect(new BearerGuard()).toBeDefined();
});
```

<aside>Pour récupérer toutes les modifications avec les tests qui fonctionnent, vous pouvez faire un checkout de la branche "step8-tests-ok" : <code>git checkout -f step8-tests-ok</code></aside>

A ce stade, tous les tests passent :
```bash
npm run test
```

Nous allons pouvoir tester les fonctionnalités de l'application en modifiant les tests existants ou en rajoutant de nouveaux tests.

Commençons par un test simple en créant le fichier `src\booking\entities\booking.entity.spec.ts` avec le contenu suivant :
```ts
import { Planet } from 'src/planet/entities/planet.entity';
import { Booking } from './booking.entity';
import { Starship } from 'src/starship/entities/starship.entity';
import * as dayjs from 'dayjs';

describe('BookingEntity', () => {
  let destination: Planet;
  let starship: Starship;

  beforeAll(async () => {
    destination = {
      id: 1,
      uuid: 'uuid',
      active: true,
      name: 'Saturn',
      distanceToEarth: 1427000000,
    };
    starship = {
      id: 1,
      uuid: 'uuid',
      active: true,
      name: 'Enterprise',
      speed: 100000,
      kilometerPrice: 2500,
    };
  });

  it('Should calculate arrival date', () => {
    // --- ARRANGE
    const booking = new Booking();
    booking.destination = destination;
    booking.starship = starship;
    booking.departureDate = new Date('2023-04-04');

    // --- ACT
    booking.processTravelTime();

    // --- ASSERT
    expect(dayjs(booking.arrivalDate).format('YYYY-MM-DD')).toEqual('2024-11-19');
  });

  it('Should calculate travel price', () => {
    // --- ARRANGE
    const booking = new Booking();
    booking.destination = destination;
    booking.starship = starship;

    // --- ACT
    booking.processPrice();

    // --- ASSERT
    expect(booking.price).toEqual(3567500000000);
  });
});
```

Nous allons maintenant tester les fonctionnalités de booking en modifiant `booking.controller.spec.ts` :
```ts
import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from 'src/planet/entities/planet.entity';
import { PlanetService } from 'src/planet/planet.service';
import { Starship } from 'src/starship/entities/starship.entity';
import { StarshipService } from 'src/starship/starship.service';
import { Repository } from 'typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

const destination = {
  id: 1,
  uuid: 'destination-uuid',
  active: true,
  name: 'Saturn',
  distanceToEarth: 1427000000,
};
const starship = {
  id: 1,
  uuid: 'starship-uuid',
  active: true,
  name: 'Enterprise',
  speed: 100000,
  kilometerPrice: 2500,
};

describe('BookingController', () => {
  let bookingController: BookingController;
  let bookingCreateDto: CreateBookingDto;
  let bookingUpdateDto: UpdateBookingDto;
  let bookingEntity: Booking;
  let planetRepository: Repository<Planet>;
  let starshipRepository: Repository<Starship>;
  let bookingRepository: Repository<Booking>;

  beforeEach(() => {
    bookingCreateDto = new CreateBookingDto();
    bookingCreateDto.destinationUuid = 'destination-uuid';
    bookingCreateDto.starshipUuid = 'starship-uuid';
    bookingCreateDto.departureDate = new Date('2023-04-04');
    bookingCreateDto.traveller = 'Michael Collins';

    bookingUpdateDto = new UpdateBookingDto();
    bookingUpdateDto.destinationUuid = 'destination-uuid';
    bookingUpdateDto.starshipUuid = 'starship-uuid';
    bookingUpdateDto.departureDate = new Date('2023-04-04');
    bookingUpdateDto.traveller = 'Michael Collins';

    bookingEntity = new Booking();
    bookingEntity.destination = destination;
    bookingEntity.starship = starship;
    bookingEntity.departureDate = new Date('2023-04-04');
    bookingEntity.traveller = 'Michael Collins';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        BookingService,
        PlanetService,
        StarshipService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
      ],
    }).compile();

    bookingController = module.get<BookingController>(BookingController);
    planetRepository = module.get<Repository<Planet>>(getRepositoryToken(Planet));
    starshipRepository = module.get<Repository<Starship>>(getRepositoryToken(Starship));
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(bookingController).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      // --- ARRANGE
      const planetRepoFindOneByUuidSpy = jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      const starshipRepoFindOneByUuidSpy = jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      const bookingRepoSaveSpy = jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      // --- ACT
      const booking = await bookingController.create(bookingCreateDto);

      // --- ASSERT
      expect(planetRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: destination.uuid });
      expect(starshipRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: starship.uuid });
      expect(bookingRepoSaveSpy).toHaveBeenCalledWith(bookingEntity);
      expect(booking).toEqual(bookingEntity);
    });

    it('should throw an unprocessable entity exception', async () => {
      // --- ARRANGE
      jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        // --- ACT
        await bookingController.create(bookingCreateDto);
      } catch (exception) {
        // --- ASSERT
        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.message).toEqual('Both destination and starship should contains existing uuids');
      }
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      // --- ARRANGE
      const bookingRepoFindOneSpy = jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(bookingEntity);
      const planetRepoFindOneByUuidSpy = jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      const starshipRepoFindOneByUuidSpy = jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      const bookingRepoSaveSpy = jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      // --- ACT
      const booking = await bookingController.update(bookingEntity.uuid, bookingUpdateDto);

      // --- ASSERT
      expect(bookingRepoFindOneSpy).toHaveBeenCalledWith({
        where: { uuid: booking.uuid },
        relations: ['starship', 'destination'],
      });
      expect(planetRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: destination.uuid });
      expect(starshipRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: starship.uuid });
      expect(bookingRepoSaveSpy).toHaveBeenCalledWith(bookingEntity);
      expect(booking).toEqual(bookingEntity);
    });

    it.each`
      destination    | starship    | errorMessage
      ${null}        | ${starship} | ${"The provided destination UUID doesn't map to an existing destination"}
      ${destination} | ${null}     | ${"The provided starship UUID doesn't map to an existing starship"}
    `('should throw unprocessables entities exceptions', async ({ destination, starship, errorMessage }) => {
      // --- ARRANGE
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(bookingEntity);
      jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      try {
        // --- ACT
        await bookingController.update(bookingEntity.uuid, bookingUpdateDto);
      } catch (exception) {
        // --- ASSERT
        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.message).toEqual(errorMessage);
      }
    });
  });
});
```

Nous pouvons modifier les tests du module de sécurité dans `bearer.guard.spec.ts` :
```ts
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'src/config/configuration';
import configurationSchema from 'src/config/schema';
import { BearerGuard } from './bearer.guard';

describe('BearerGuard', () => {
  let bearerGuard: BearerGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          load: [configuration],
          validationSchema: configurationSchema,
          validationOptions: {
            abortEarly: true,
          },
        }),
      ],
      providers: [BearerGuard],
    }).compile();

    bearerGuard = module.get<BearerGuard>(BearerGuard);
    configService = await module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(bearerGuard).toBeDefined();
  });

  it.each`
    bearer          | expected
    ${''}           | ${true}
    ${'bad-bearer'} | ${false}
  `('should authorized request or not', async ({ bearer, expected }) => {
    // --- ARRANGE
    // Twist to use the config because it's unavailable in the each parameters context
    bearer = expected ? configService.get<string>('security.apiBearer') : bearer;

    const mockExecutionContext: ExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${bearer}`,
          },
        }),
      }),
    });

    // --- ACT
    const isAuthorized = await bearerGuard.canActivate(mockExecutionContext);

    // --- ASSERT
    expect(isAuthorized).toEqual(expected);
  });
});
```

Nous allons maintenant créer un test "end to end" en créant le fichier `src\starship\starship.controller.e2e.spec.ts` :
```ts
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import configurationSchema from 'src/config/schema';
import { BearerGuard } from 'src/security/bearer.guard';
import { StarshipModule } from 'src/starship/starship.module';
import * as request from 'supertest';

describe('StarshipController', () => {
  let app: NestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          load: [configuration],
          validationSchema: configurationSchema,
          validationOptions: {
            abortEarly: true,
          },
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'sqlite',
              database: configService.get('database.path'),
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
            } as TypeOrmModuleOptions;
          },
        }),
        StarshipModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestApplication>();
    configService = app.get<ConfigService>(ConfigService);

    // SECURITY
    app.useGlobalGuards(new BearerGuard(configService));

    // VERSIONNING
    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Only expose attributes wille be accepted on incoming DTO
        transform: true, // Automatically converts attributes from incoming DTO when possible
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  describe('create', () => {
    it(`/v1/starships (GET)(SUCCESS)`, async () => {
      const result = await request(app.getHttpServer())
        .get('/v1/starships')
        .set('Authorization', `Bearer ${configService.get<string>('security.apiBearer')}`)
        .expect(200)
        .expect((res) => expect(res.body[0].name).toEqual('Millenium falcon'));
    });
  });
});
```

Le taux de couverture des tests peut être vérifié avec la commande `npm run test:cov` :
![Tests coverage](nestjs/img/coverage.png)
