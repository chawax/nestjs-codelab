import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PlanetModule } from 'src/planet/planet.module';
import { StarshipModule } from 'src/starship/starship.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [PlanetModule, StarshipModule, TypeOrmModule.forFeature([Booking])],
})
export class BookingModule {}
