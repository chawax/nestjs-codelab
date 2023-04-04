import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsUUID, IsString, IsDate } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsUUID()
  destinationUuid: string;

  @ApiProperty()
  @IsUUID()
  starshipUuid: string;

  @ApiProperty()
  @IsString()
  traveller: string;

  @ApiProperty()
  @IsDate()
  departureDate: Date;
}
