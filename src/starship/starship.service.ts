import { Injectable } from '@nestjs/common';
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
  ) {}

  create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    return this.starshipRepository.save(createStarshipDto);
  }

  update(id: number, updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    return this.starshipRepository.save({id, ...updateStarshipDto});
  }

  remove(id: number): Promise<DeleteResult> {
    return this.starshipRepository.delete({id});
  }

  findAll(): Promise<Starship[]> {
    return this.starshipRepository.find();
  }

  findAvailableStarships(): Promise<Starship[]> {
    return this.starshipRepository.find({
      where: { active: true },
    });
  }

  findOne(id: number): Promise<Starship> {
    return this.starshipRepository.findOneBy({id});
  }
}
