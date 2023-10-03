import { Module } from '@nestjs/common';
import { GameApisService } from './game-apis.service';
import { GameApisController } from './game-apis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'model/t_game';
import { Wallet, WalletSchema } from 'model/t_wallet';
import { Auth, AuthSchema } from 'model/t_auth';
import { GameLogic, GameLogicSchema } from 'model/t_game_logic';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: GameLogic.name, schema: GameLogicSchema },
    ]),
  ],
  controllers: [GameApisController],
  providers: [GameApisService],
})
export class GameApisModule {}
