import { Body, Controller, Delete, Get, Param, Patch, Post, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { Starship } from './entities/starship.entity';
import { StarshipService } from './starship.service';

@ApiTags('starships')
@Controller({ path: '/starships', version: '1' })
export class StarshipController {
  constructor(private readonly starshipService: StarshipService) {}

  @Post()
  create(@Body() createStarshipDto: CreateStarshipDto) {
    return this.starshipService.create(createStarshipDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStarshipDto: UpdateStarshipDto): Promise<Starship> {
    return this.starshipService.update(id, updateStarshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.starshipService.remove(id);
  }

  @Get()
  findAll(): Promise<Starship[]> {
    return this.starshipService.findAll();
  }

  @Version('2')
  @Get('/available-starships')
  findAvailableStarships(): Promise<Starship[]> {
    return this.starshipService.findAvailableStarships();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Starship> {
    return this.starshipService.findOne(+id);
  }
}
