import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanetModule } from './planet/planet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {          
          type: 'sqlite',
          database: configService.get('SQL_MEMORY_DB_SHARED'),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: true
        } as TypeOrmModuleOptions;
      },
    }),    
    PlanetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
