import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { Starship } from './entities/starship.entity';

@Injectable()
export class StarshipService {
  constructor(
    @InjectRepository(Starship)
    private readonly starshipRepository: Repository<Starship>,
  ) { }

  create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    return this.starshipRepository.save(createStarshipDto);
  }

  async update(uuid: string, updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    const starship = await this.findOneByUuid(uuid);

    if (!starship) {
      throw new NotFoundException();
    }

    await this.starshipRepository.save({ id: starship.id, ...updateStarshipDto });

    return this.findOneByUuid(uuid);
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const starship = await this.findOneByUuid(uuid);

    if (!starship) {
      throw new NotFoundException();
    }

    return this.starshipRepository.delete({ uuid });
  }

  findAll(): Promise<Starship[]> {
    return this.starshipRepository.find();
  }

  findAvailableStarships(): Promise<Starship[]> {
    return this.starshipRepository.find({
      where: { active: true },
    });
  }

  findOneByUuid(uuid: string): Promise<Starship | null> {
    return this.starshipRepository.findOneBy({ uuid });
  }
}
