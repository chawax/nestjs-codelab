import { Module } from '@nestjs/common';
import { StarshipService } from './starship.service';
import { StarshipController } from './starship.controller';
import { Starship } from './entities/starship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StarshipController],
  providers: [StarshipService],
  imports: [TypeOrmModule.forFeature([Starship])],
  exports: [StarshipService],
})
export class StarshipModule {}
