import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePlanetDto {
  @ApiProperty()  
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  distanceToEarth: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;
}
