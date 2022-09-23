import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async update(uuid: string, updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    return this.planetRepository.save({ id: planet.id, ...updatePlanetDto });
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const planet = await this.findOneByUuid(uuid);

    if (!planet) {
      throw new NotFoundException();
    }

    return this.planetRepository.delete({ uuid });
  }

  findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }

  findAvailableDestinations(): Promise<Planet[]> {
    return this.planetRepository.find({
      where: { active: true },
    });
  }

  findOneByUuid(uuid: string): Promise<Planet | null> {
    return this.planetRepository.findOneBy({ uuid });
  }
}
