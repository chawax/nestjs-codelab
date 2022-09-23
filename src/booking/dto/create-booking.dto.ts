import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { UpdatePlanetDto } from 'src/planet/dto/update-planet.dto';
import { UpdateStarshipDto } from 'src/starship/dto/update-starship.dto';

export class CreateBookingDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @Expose()
  @IsObject()
  @ValidateNested()
  destination: UpdatePlanetDto;
  
  @ApiProperty()
  @Expose()
  @IsObject()
  @ValidateNested()
  starship: UpdateStarshipDto;

  @ApiProperty()
  @Expose()
  @IsString()
  traveller: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  departureDate: Date;
}
