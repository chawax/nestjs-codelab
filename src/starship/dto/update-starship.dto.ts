import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { CreateStarshipDto } from './create-starship.dto';

export class UpdateStarshipDto extends PartialType(CreateStarshipDto) {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  uuid: string;
}
