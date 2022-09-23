import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanetService } from 'src/planet/planet.service';
import { StarshipService } from 'src/starship/starship.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly planetService: PlanetService,
    private readonly starshipService: StarshipService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {    
    const destination = await this.planetService.findOneByUuid(createBookingDto.destination.uuid);
    const starship = await this.starshipService.findOneByUuid(createBookingDto.starship.uuid);

    if (!destination || !starship) {
      throw new UnprocessableEntityException('Both destination and starship should contains existing uuids');
    }

    createBookingDto.destination = destination;
    createBookingDto.starship = starship;

    return this.bookingRepository.save(createBookingDto);
  }
  
  async update(uuid: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOneByUuid(uuid);

    if (!booking) {
      throw new NotFoundException();
    }

    const destination = await this.planetService.findOneByUuid(updateBookingDto.destination.uuid);
    const starship = await this.starshipService.findOneByUuid(updateBookingDto.starship.uuid);

    if (!destination || !starship) {
      throw new UnprocessableEntityException('Both destination and starship should contains existing uuids');
    }

    updateBookingDto.destination = destination;
    updateBookingDto.starship = starship;

    return this.bookingRepository.save({id: booking.id, ...updateBookingDto});
  }

  remove(uuid: string): Promise<DeleteResult> {
    return this.bookingRepository.delete({uuid});
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['starship', 'destination'] });
  }

  findOneByUuid(uuid: string): Promise<Booking> {
    return this.bookingRepository.findOne({where: {uuid},  relations: ['starship', 'destination'] });
  }
}
