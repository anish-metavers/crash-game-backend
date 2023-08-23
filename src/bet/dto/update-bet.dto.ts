import { PartialType } from '@nestjs/mapped-types';
import { CreateBetDto } from './create-bet.dto';

export class UpdateBetDto extends PartialType(CreateBetDto) {
  gameId: string;
  amount: number;
  payout: number;
}
