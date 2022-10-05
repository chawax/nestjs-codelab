import { Module } from '@nestjs/common';
import { StarshipService } from './starship.service';
import { StarshipController } from './starship.controller';

@Module({
  controllers: [StarshipController],
  providers: [StarshipService]
})
export class StarshipModule {}
