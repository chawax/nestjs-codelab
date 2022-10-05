import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from './entities/planet.entity';
import { DeleteResult } from 'typeorm';

@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetService.create(createPlanetDto);
  }

  @Get()
  findAll() {
    return this.planetService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Planet> {
    const planet = await this.planetService.findOneByUuid(uuid);

    if (planet) {
      return planet;
    }

    throw new NotFoundException();
  }

  @Patch(':uuid')
  update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    return this.planetService.update(uuid, updatePlanetDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.planetService.remove(uuid);
  }
}
