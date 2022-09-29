import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @IsUUID()
    @IsOptional()
    uuid: string;
}
