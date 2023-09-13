import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { GameGateway } from 'src/game/game.gateway';
import { Game, GameDocument } from 'model/t_game';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { Bet, BetDocument } from 'model/t_bet';
const CryptoJS = require('crypto-js');

export let gameStatus = 'Game Waiting';
export let bettingTime = 0;
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
  private SocketServer = null;

  private flags = false;
  private readonly logger = new Logger(CrashGameCronService.name);
  @Cron('*/01 * * * * *')
  async handleCrashGame() {
    if (this.flags == false) {
      try {
        this.logger.debug('Crash game service is running 1 seconds');
        this.flags = true;
        if (!this.SocketServer) {
          this.SocketServer = this.gameGateway.getSocketServer();
        }
        let resultX = [];
        let hashX = [];
        let multipliers = 1;
        let serverSpeed = 0.00001;
        let lastTime = Date.now();
        let indexId = 0;
        let countdownTimer = null;

        const gameLoop = async () => {
          let now = Date.now();
          let deltaTime = (now - lastTime) / 1000; // in seconds
          lastTime = now;
          deltaTime = deltaTime * 30;
          serverSpeed = serverSpeed + 0.0001;

          multipliers = multipliers + serverSpeed;

          // serverSpeed = serverSpeed + (serverSpeed / (200 * 4)) * deltaTime;
          console.log(
            multipliers.toFixed(2),
            'crash at',
            resultX[indexId],
            'crash id',
            indexId,
          );

          // Reset game if crashed
          if (multipliers >= resultX[indexId]) {
            this.SocketServer.emit('crashNumber', {
              crashNumber: resultX[indexId],
            });
            console.log('crashed at', multipliers);
            console.log('hash value', hashX[indexId]);
            multipliers = 1.0;

            console.log('this is indexId :', indexId);
            serverSpeed = 0.0014;

            // mongodb save data like multiplier values
            const gameEnded = await this.gameModel.findOneAndUpdate(
              { gameCrashNumber: 0 },
              {
                // crashId: indexId,
                gameCrashNumber: resultX[indexId],
              },
            );

            // function calling settle wallets
            this.settleWallet(gameEnded._id.toString());

            // Stop the game loop temporarily
            clearTimeout(countdownTimer);
            const countDocuments = await this.gameModel.countDocuments();
            const game = await this.gameModel.create({
              gameCrashNumber: 0,
              crashId: 1000 + countDocuments,
              isBetActive: true,
            });
            let gameId = game._id;
            console.log(game);

            indexId = indexId + 1;
            bettingTime = 15;

            countdownTimer = setInterval(async () => {
              console.log(`Resuming game in ${bettingTime} seconds...`);
              bettingTime--;
              if (bettingTime === 0) {
                clearInterval(countdownTimer);
                bettingTime = 0;

                await this.gameModel.updateOne(
                  { _id: gameId },
                  { isBetActive: false },
                );
                const userBets = await this.betModel.find({
                  gameId: gameId,
                  crashNumber: null,
                });
                for (let userBet of userBets) {
                  const change = 0 - +userBet.amount;
                  await this.walletModel.findOneAndUpdate(
                    {
                      userId: userBet.userId,
                    },
                    { $inc: { amount: change } },
                  );
                }

                gameLoop(); // Resume the game loop after the countdown
              }
            }, 1000);
          } else {
            setTimeout(gameLoop, 1000 / 15); // 15 frames per second
          }
        };

        const gameResultGenrator = async () => {
          const gameAmountInput = 100000;
          const gameHashInput = 'exampledssdhash';
          const gameSaltInput = 'exampefrflesalt';
          let prevHash = null;
          for (let i = 0; i < gameAmountInput; i++) {
            let hash = String(
              prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHashInput,
            );
            hashX.push(hash);
            gameResult(hash, gameSaltInput);
            prevHash = hash;
          }
          resultX = resultX.reverse();
          hashX = hashX.reverse();
          console.log('Game hash data', hashX);
          console.log('Game data', resultX);
          gameLoop();
        };

        const gameResult = (seed, salt) => {
          const nBits = 52; // number of most significant bits to use
          if (salt) {
            const hmac = CryptoJS.HmacSHA256(
              CryptoJS.enc.Hex.parse(seed),
              salt,
            );
            seed = hmac.toString(CryptoJS.enc.Hex);
          }
          seed = seed.slice(0, nBits / 4);
          const r = parseInt(seed, 16);
          let X = r / Math.pow(2, nBits);
          X = parseFloat(X.toPrecision(9));
          X = 99 / (1 - X);
          const result = Math.floor(X);
          // console.log(Math.max(1, result / 100));
          resultX.push(Math.max(1, result / 100));
          // resultx.push(2);
          return Math.max(1, result / 100);
        };
        gameResultGenrator();
      } catch (error) {
        console.log(error);
        this.flags = false;
      }
    }
  }

  async settleWallet(gameId: string) {
    try {
      const find = await this.gameModel.findById(gameId);
      await this.betModel.updateMany(
        { gameId: gameId },
        { $set: { crashNumber: find.gameCrashNumber, profit: 0 } },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
