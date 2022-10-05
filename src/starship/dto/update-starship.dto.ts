import { PartialType } from '@nestjs/swagger';
import { CreateStarshipDto } from './create-starship.dto';

export class UpdateStarshipDto extends PartialType(CreateStarshipDto) {}
