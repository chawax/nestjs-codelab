import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePlanetDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  distanceToEarth: number;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
