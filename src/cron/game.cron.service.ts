import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { Game, GameDocument } from 'model/t_game';
import { Model } from 'mongoose';
export let gameStatus = 'Game Waiting';
@Injectable()
export class GameCronService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    private gameGateway: GameGateway,
  ) {}

  SocketServer: Server = null;
  private readonly logger = new Logger(GameCronService.name);

  @Cron('*/1 * * * * *')
  async handleCron() {
    this.logger.debug('Game service is running 1 seconds');
    if (!this.SocketServer) {
      this.SocketServer = this.gameGateway.getSocketServer();
    } else {
      // Betting Is Open
      if (gameStatus == 'Game Waiting') {
        gameStatus = 'Betting Open';
        this.gameModel.create({
          gameStatus: gameStatus,
        });
      } else if (gameStatus == 'Betting Open') {
        this.SocketServer.emit('response', { data: 'Betting Open' });
        setTimeout(async () => {
          gameStatus = 'Betting Close';
          await this.gameModel.updateOne(
            {
              gameStatus: 'Betting Open',
            },
            {
              $set: { gameStatus: 'Betting Close' },
            },
          );
          this.SocketServer.emit('response', { data: 'Betting Close' });
        }, 5000);
      } else if (gameStatus == 'Betting Close') {
        gameStatus = 'Game Finished';
        let x = ((Math.random() * 100) / 10 + 1).toFixed(2);

        setTimeout(async () => {
          await this.gameModel.updateOne(
            {
              gameStatus: 'Betting Close',
            },
            {
              $set: {
                gameCrashNumber: x,
                gameStatus: 'Game Finished',
              },
            },
          );
          gameStatus = 'Game Waiting';
          this.SocketServer.emit('response', { gameCrash: x });
        }, Math.sqrt(Number(x)) * 1000);
      } else if (gameStatus == 'Game Finished') {
        this.gameModel.updateOne({
          gameStatus: gameStatus,
        });
        this.SocketServer.emit('response', { data: 'Game Finished' });
      }
    }
  }
}
