import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateStarshipDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  speed: number;

  @ApiProperty()
  @IsNumber()
  kilometerPrice: number;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
