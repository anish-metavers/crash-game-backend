import { Module } from '@nestjs/common';
import { BettingService } from './betting.service';
import { BettingGateway } from './betting.gateway';

@Module({
  providers: [BettingGateway, BettingService]
})
export class BettingModule {}
