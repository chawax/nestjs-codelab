import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { CreatePlanetDto } from './create-planet.dto';

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  uuid: string;
}
