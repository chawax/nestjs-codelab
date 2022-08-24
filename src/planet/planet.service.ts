import { InjectRepository, Repository } from '@homeofthings/nestjs-sqlite3';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from './entities/planet.entity';

@Injectable()
export class PlanetService {

  constructor(
    @InjectRepository(Planet)
    private readonly planetsRepository: Repository<Planet>,
  ) {}

  create(createPlanetDto: CreatePlanetDto) {
    const planet = plainToInstance(Planet, createPlanetDto);
    this.planetsRepository.save(planet)
    return 'This action adds a new planet';
  }

  findAll() {
    return this.planetsRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} planet`;
  }

  update(id: number, updatePlanetDto: UpdatePlanetDto) {
    return `This action updates a #${id} planet`;
  }

  remove(id: number) {
    return `This action removes a #${id} planet`;
  }
}
