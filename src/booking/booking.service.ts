import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToClassFromExist, instanceToInstance, instanceToPlain, plainToClass, plainToClassFromExist, plainToInstance } from 'class-transformer';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  create(createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingRepository.save(createBookingDto);
  }
  
  update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    return this.bookingRepository.save({id, ...updateBookingDto});
  }

  remove(id: number): Promise<DeleteResult> {
    return this.bookingRepository.delete({id});
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['starship', 'destination'] });
  }

  findOne(id: number): Promise<Booking> {
    return this.bookingRepository.findOne({where: {id},  relations: ['starship', 'destination'] });
  }

}
