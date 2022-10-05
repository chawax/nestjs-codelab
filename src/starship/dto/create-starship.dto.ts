import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateStarshipDto {
  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  speed: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  kilometerPrice: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;
}
