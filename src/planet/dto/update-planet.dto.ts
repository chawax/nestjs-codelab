import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePlanetDto } from './create-planet.dto';

export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
