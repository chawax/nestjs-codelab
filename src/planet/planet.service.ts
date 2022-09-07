import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from './entities/planet.entity';

@Injectable()
export class PlanetService {
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>,
  ) {}

  create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetRepository.save(createPlanetDto);
  }

  update(id: number, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    return this.planetRepository.save({id, ...updatePlanetDto});
  }

  remove(id: number): Promise<DeleteResult> {
    return this.planetRepository.delete({ id });
  }

  findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }

  findAvailableDestinations(): Promise<Planet[]> {
    return this.planetRepository.find({
      where: { active: true },
    });
  }

  findOne(id: number): Promise<Planet> {
    return this.planetRepository.findOneBy({ id });
  }
}
