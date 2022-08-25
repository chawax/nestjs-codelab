import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanetDto } from './create-planet.dto';

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {}
