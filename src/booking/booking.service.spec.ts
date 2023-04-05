import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from 'src/planet/entities/planet.entity';
import { PlanetService } from 'src/planet/planet.service';
import { Starship } from 'src/starship/entities/starship.entity';
import { StarshipService } from 'src/starship/starship.service';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

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
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
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
