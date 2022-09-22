import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller({ path: '/booking', version: '1' })
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.bookingService.remove(id);
  }

  @Get()
  findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }
}
