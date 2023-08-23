import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { Game, GameDocument } from 'model/t_game';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { Bet, BetDocument } from 'model/t_bet';
export let gameStatus = 'Game Waiting';
@Injectable()
export class CrashGameCronService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    @InjectModel(Bet.name)
    private betModel: Model<BetDocument>,
    private gameGateway: GameGateway,
  ) {}

  private gameId = '';
  private SocketServer = null;
  private readonly logger = new Logger(CrashGameCronService.name);
  private betOpenFlag = true;
  @Cron('*/01 * * * * *')
  async handleCronForCrashGame() {
    this.logger.debug('Game service is running 1 seconds');
    try {
      if (!this.SocketServer) {
        this.SocketServer = this.gameGateway.getSocketServer();
      } else {
        // Betting Is Open
        if (gameStatus == 'Game Waiting') {
          gameStatus = 'Betting Open';
          const result = await this.gameModel.create({
            gameStatus: gameStatus,
          });
          this.gameId = result._id.toString();
          console.log(result);
          this.betOpenFlag = true;
        } else if (gameStatus == 'Betting Open') {
          this.SocketServer.emit('response', {
            data: 'Betting Open',
            gameId: this.gameId,
          });
          if (this.betOpenFlag) {
            this.betOpenFlag = false;
            setTimeout(async () => {
              gameStatus = 'Betting Close';
              await this.gameModel.findByIdAndUpdate(this.gameId, {
                $set: {
                  gameStatus: 'Betting Close',
                },
              });
              this.SocketServer.emit('response', { data: 'Betting Close' });
            }, 20000);
          }
        } else if (gameStatus == 'Betting Close') {
          gameStatus = 'Game Is Running';
          const userBets = await this.betModel.find({
            gameId: this.gameId,
            crashNumber: null,
          });

          for (let userBet of userBets) {
            const change = 0 - +userBet.amount;
            const res = await this.walletModel.findOneAndUpdate(
              {
                userId: userBet.userId,
              },
              { $inc: { amount: change } },
            );
          }
          let x = ((Math.random() * 100) / 10 + 1).toFixed(2);

          setTimeout(async () => {
            await this.gameModel.findByIdAndUpdate(this.gameId, {
              $set: {
                gameCrashNumber: x,
                gameStatus: 'Game Finished',
              },
            });
            // console.log('now2');

            gameStatus = 'Game Finished';
            this.SocketServer.emit('response', { gameCrash: x });
          }, /*Math.sqrt(Number(x)) * 1000 */ Number(x));
        } else if (gameStatus == 'Game Finished') {
          this.SocketServer.emit('response', { data: 'Game Finished' });
          gameStatus = 'Game Waiting';
          // console.log('now');
          this.setWallet(this.gameId);
        } else if (gameStatus == 'Game Is Running') {
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setWallet(gameId: string) {
    try {
      const find = await this.gameModel.findById(gameId);
      this.betModel.updateMany(
        { gameId: find._id },
        { $set: { crashNumber: find.gameCrashNumber } },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
