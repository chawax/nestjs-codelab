import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetController } from './planet.controller';
import { PlanetService } from './planet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetController],
  providers: [PlanetService],
  exports: [TypeOrmModule.forFeature([Planet])],
})
export class PlanetModule {}
