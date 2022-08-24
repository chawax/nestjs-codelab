import { Sqlite3Module } from '@homeofthings/nestjs-sqlite3';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanetModule } from './planet/planet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Sqlite3Module.register({file: process.env.SQL_MEMORY_DB_SHARED}),
    PlanetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
