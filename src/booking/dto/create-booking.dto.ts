import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { Planet } from 'src/planet/entities/planet.entity';
import { Starship } from 'src/starship/entities/starship.entity';

export class CreateBookingDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @Expose()
  @IsObject()
  destination: any;
  
  @ApiProperty()
  @Expose()
  @IsObject()
  starship: any;

  @ApiProperty()
  @Expose()
  @IsString()
  traveller: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  departureDate: Date;
}
