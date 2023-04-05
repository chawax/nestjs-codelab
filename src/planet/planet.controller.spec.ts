import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetController } from './planet.controller';
import { PlanetService } from './planet.service';

describe('PlanetController', () => {
  let controller: PlanetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetController],
      providers: [
        PlanetService,
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<PlanetController>(PlanetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
