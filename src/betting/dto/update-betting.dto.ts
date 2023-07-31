import { PartialType } from '@nestjs/mapped-types';
import { CreateBettingDto } from './create-betting.dto';

export class UpdateBettingDto extends PartialType(CreateBettingDto) {
  id: number;
}
