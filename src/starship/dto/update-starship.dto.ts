import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateStarshipDto } from './create-starship.dto';

export class UpdateStarshipDto extends PartialType(CreateStarshipDto) {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  uuid: string;
}
