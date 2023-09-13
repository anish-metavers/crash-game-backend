import { Module } from '@nestjs/common';
import { BetService } from './bet.service';
import { BetController } from './bet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bet, BetSchema } from 'model/t_bet';
import { Auth, AuthSchema } from 'model/t_auth';
import { Game, GameSchema } from 'model/t_game';
import { Wallet, WalletSchema } from 'model/t_wallet';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature([{ name: Bet.name, schema: BetSchema }]),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [BetController],
  providers: [BetService],
})
export class BetModule {}
