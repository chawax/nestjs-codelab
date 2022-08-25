import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetController } from './planet.controller';
import { PlanetService } from './planet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Planet])
  ],
  controllers: [PlanetController],
  providers: [PlanetService]
})
export class PlanetModule {}
