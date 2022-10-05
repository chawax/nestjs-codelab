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
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly planetService: PlanetService,
    private readonly starshipService: StarshipService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const destination = await this.planetService.findOneByUuid(createBookingDto.destinationUuid);
    const starship = await this.starshipService.findOneByUuid(createBookingDto.starshipUuid);

    if (!destination || !starship) {
      throw new UnprocessableEntityException('Both destination and starship should contains existing uuids');
    }

    const booking: Booking = new Booking();
    booking.active = createBookingDto.active;
    booking.departureDate = createBookingDto.departureDate;
    booking.traveller = createBookingDto.traveller;
    booking.destination = destination;
    booking.starship = starship;

    return this.bookingRepository.save(booking);
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['starship', 'destination'] });
  }

  findOneByUuid(uuid: string): Promise<Booking> {
    return this.bookingRepository.findOne({ where: { uuid }, relations: ['starship', 'destination'] });
  }

  async update(uuid: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOneByUuid(uuid);

    if (!booking) {
      throw new NotFoundException();
    }

    if (updateBookingDto.destinationUuid) {
      const destination = await this.planetService.findOneByUuid(updateBookingDto.destinationUuid);
      if (!destination) {
        throw new UnprocessableEntityException("The provided destination UUID doesn't map to an existing destination");
      }
      booking.destination = destination;
    }

    if (updateBookingDto.starshipUuid) {
      const starship = await this.starshipService.findOneByUuid(updateBookingDto.starshipUuid);
      if (!starship) {
        throw new UnprocessableEntityException("The provided starship UUID doesn't map to an existing starship");
      }
      booking.starship = starship;
    }

    booking.active = updateBookingDto.active;
    booking.departureDate = updateBookingDto.departureDate;
    booking.traveller = updateBookingDto.traveller;

    return this.bookingRepository.save(booking);
  }

  remove(uuid: string): Promise<DeleteResult> {
    return this.bookingRepository.delete({ uuid });
  }
}
