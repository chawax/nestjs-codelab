import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';

@Module({
  controllers: [PlanetController],
  providers: [PlanetService],
  imports: [TypeOrmModule.forFeature([Planet])],
  exports: [PlanetService],
})
export class PlanetModule {}
