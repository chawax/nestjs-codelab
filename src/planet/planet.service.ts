import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
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

  findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }

  findOneByUuid(uuid: string): Promise<Planet | null> {
    return this.planetRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    await this.planetRepository.save({ id: planet.id, ...updatePlanetDto });

    return this.findOneByUuid(uuid);
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    return this.planetRepository.delete({ uuid });
  }
}
