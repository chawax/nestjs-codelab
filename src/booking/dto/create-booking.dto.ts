import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsUUID, IsString, IsDate } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @Expose()
  @IsUUID()
  destinationUuid: string;

  @ApiProperty()
  @Expose()
  @IsUUID()
  starshipUuid: string;

  @ApiProperty()
  @Expose()
  @IsString()
  traveller: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  departureDate: Date;
}
