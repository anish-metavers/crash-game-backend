import { PartialType } from '@nestjs/mapped-types';
import { CreateBetDto } from './create-bet.dto';

export class UpdateBetDto extends PartialType(CreateBetDto) {
  amount: number;
  payout: number;
}
