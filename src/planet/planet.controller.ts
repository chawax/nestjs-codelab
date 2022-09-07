import { Body, Controller, Delete, Get, Param, Patch, Post, SerializeOptions, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GROUP_ADMIN_USERS } from 'src/app.module';
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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePlanetDto: UpdatePlanetDto): Promise<Planet> {
    return this.planetService.update(id, updatePlanetDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: number): Promise<DeleteResult> {
    return this.planetService.remove(id);
  }

  @Get()
  @SerializeOptions({
    groups: [GROUP_ADMIN_USERS],
  })
  findAll(): Promise<Planet[]> {
    return this.planetService.findAll();
  }

  @Version('2')
  @Get('/available-destinations')
  findAvailableDesintations(): Promise<Planet[]> {
    return this.planetService.findAvailableDestinations();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Planet> {
    return this.planetService.findOne(id);
  }
}
