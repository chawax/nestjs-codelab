import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from 'src/starship/entities/starship.entity';
import { Planet } from 'src/planet/entities/planet.entity';
import { PlanetService } from 'src/planet/planet.service';
import { StarshipService } from 'src/starship/starship.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        PlanetService,
        StarshipService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
