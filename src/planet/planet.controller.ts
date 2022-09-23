import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Version
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Planet } from './entities/planet.entity';
import { PlanetService } from './planet.service';

@ApiTags('planets')
@Controller({ path: '/planets', version: '1' })
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetService.create(createPlanetDto);
  }

  @Patch(':uuid')
  update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    return this.planetService.update(uuid, updatePlanetDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<DeleteResult> {
    return this.planetService.remove(uuid);
  }

  @Get()
  findAll(): Promise<Planet[]> {
    return this.planetService.findAll();
  }

  @Version('2')
  @Get('/available-destinations')
  findAvailableDesintations(): Promise<Planet[]> {
    return this.planetService.findAvailableDestinations();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Planet> {
    const planet = await this.planetService.findOneByUuid(uuid);

    if (planet) {
      return planet;
    }

    throw new NotFoundException();
  }
}
