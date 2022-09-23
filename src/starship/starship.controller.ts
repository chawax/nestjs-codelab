import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Version } from '@nestjs/common';
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

  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateStarshipDto: UpdateStarshipDto,
  ): Promise<Starship> {
    return this.starshipService.update(uuid, updateStarshipDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.starshipService.remove(uuid);
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

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Starship> {
    return this.starshipService.findOneByUuid(uuid);
  }
}
