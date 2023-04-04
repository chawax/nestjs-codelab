import { Test, TestingModule } from '@nestjs/testing';
import { StarshipController } from './starship.controller';
import { StarshipService } from './starship.service';
import { Starship } from './entities/starship.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('StarshipController', () => {
  let controller: StarshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarshipController],
      providers: [
        StarshipService,
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<StarshipController>(StarshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
