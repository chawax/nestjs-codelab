import { Test, TestingModule } from '@nestjs/testing';
import { StarshipService } from './starship.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';

describe('StarshipService', () => {
  let service: StarshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipService,
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StarshipService>(StarshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
