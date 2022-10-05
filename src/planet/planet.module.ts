import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';

@Module({
  controllers: [PlanetController],
  providers: [PlanetService]
})
export class PlanetModule {}
