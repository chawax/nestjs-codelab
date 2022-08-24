import { Sqlite3Module } from '@homeofthings/nestjs-sqlite3';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanetModule } from './planet/planet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Sqlite3Module.register({file: process.env.SQL_MEMORY_DB_SHARED}),
    PlanetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
