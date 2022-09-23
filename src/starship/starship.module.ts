import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { StarshipController } from './starship.controller';
import { StarshipService } from './starship.service';

@Module({
  imports: [TypeOrmModule.forFeature([Starship])],
  controllers: [StarshipController],
  providers: [StarshipService],
  exports: [TypeOrmModule.forFeature([Starship])],
})
export class StarshipModule {}
