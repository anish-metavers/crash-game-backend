export class CreateBetDto {
  gameId: string;
  userId: string;
  walletId: string;
  amount: number;
  payout: number;
  time: Date;
}
