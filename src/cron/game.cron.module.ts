import { Module } from '@nestjs/common';
import { CrashGameCronService } from './game.cron.service';
import { GameModule } from 'src/game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Game, GameSchema } from 'model/t_game';
import { Wallet, WalletSchema } from 'model/t_wallet';
import { Bet, BetSchema } from 'model/t_bet';
@Module({
  imports: [
    GameModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: Bet.name, schema: BetSchema }]),
  ],
  providers: [CrashGameCronService],
})
export class CrashGameCronModule {}
