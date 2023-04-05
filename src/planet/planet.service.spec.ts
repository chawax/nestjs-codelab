import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from './planet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from './entities/planet.entity';

describe('PlanetService', () => {
  let service: PlanetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetService,
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlanetService>(PlanetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
