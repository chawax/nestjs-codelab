import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { PlanetModule } from 'src/planet/planet.module';
import { StarshipModule } from 'src/starship/starship.module';
import { PlanetService } from 'src/planet/planet.service';
import { StarshipService } from 'src/starship/starship.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    PlanetModule,
    StarshipModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, PlanetService, StarshipService]
})
export class BookingModule {}
