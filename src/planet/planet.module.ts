import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { Sqlite3Module } from '@homeofthings/nestjs-sqlite3';
import { Planet } from './entities/planet.entity';

@Module({
  imports: [
    Sqlite3Module.forFeature([Planet]),
  ],
  controllers: [PlanetController],
  providers: [PlanetService]
})
export class PlanetModule {}
