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
