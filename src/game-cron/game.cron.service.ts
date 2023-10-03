import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { GameGateway } from 'src/game/game.gateway';
import { Game, GameDocument } from 'model/t_game';
import mongoose, { Model } from 'mongoose';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { Bet, BetDocument } from 'model/t_bet';
import { GameLogic, GameLogicDocument } from 'model/t_game_logic';
const CryptoJS = require('crypto-js');

export let gameStatus = 'Game Waiting';
export let bettingTime = 0;
let allBetResponse = [];
let resultX = [];
let hashX = [];
let gameNumber;
let multipliers = 1;
@Injectable()
export class CrashGameCronService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    @InjectModel(Bet.name)
    private betModel: Model<BetDocument>,
    @InjectModel(GameLogic.name)
    private gameLogicModel: Model<GameLogicDocument>,
    private gameGateway: GameGateway,
  ) {}
  private SocketServer = null;
  private flags = false;
  private readonly logger = new Logger(CrashGameCronService.name);

  @Cron('*/01 * * * * *')
  async handleCrashGame() {
    const game = await this.gameLogicModel.find();
    gameNumber = game[0].gameNumber;

    if (this.flags == false) {
      try {
        this.logger.debug('Crash game service is running 1 seconds');
        this.flags = true;
        if (!this.SocketServer) {
          this.SocketServer = this.gameGateway.getSocketServer();
        }
        let serverSpeed = 0.00001;
        let lastTime = Date.now();
        let indexId = 1;
        let countdownTimer = null;

        const gameLoop = async () => {
          let now = Date.now();
          let deltaTime = (now - lastTime) / 1000; // in seconds
          lastTime = now;
          deltaTime = deltaTime * 30;
          serverSpeed = serverSpeed + 0.0001;

          multipliers = multipliers + serverSpeed;

          console.log(
            multipliers.toFixed(2),
            'crash at',
            resultX[indexId],
            'crash id',
            indexId,
          );

          this.SocketServer.emit('Multipliers', {
            multipliers: `${multipliers.toFixed(2)}
            'crash at'
            ${resultX[indexId]}`,
          });

          // Reset game if crashed
          if (multipliers >= resultX[indexId]) {
            this.SocketServer.emit('crashNumber', {
              crashNumber: resultX[indexId],
            });
            console.log('crashed at', multipliers.toFixed(2));
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
            allBetResponse = [];
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
            bettingTime = 10;

            countdownTimer = setInterval(async () => {
              this.SocketServer.emit('bettingTime', { bettingTime });
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
          const gameAmountInput = 10000;
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
          // this.SocketServer.emit('gameData', { resultX });
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
          resultX.push(Math.max(1, result / gameNumber).toFixed(2));
          // resultx.push(2);
          return Math.max(1, result / gameNumber);
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
        { $set: { crashNumber: find.gameCrashNumber } },
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export const addBetLoacal = (obj) => {
  allBetResponse.push(obj);
};

export const getBetsLocal = () => {
  return allBetResponse;
};

export const cashOut = async (
  userId: string,
  betModel: any,
  walletModel: any,
) => {
  // Find the user's bet in the normalBet array
  console.log('user data :', allBetResponse);

  const userBetIndex = allBetResponse.findIndex((bet) => bet.userId === userId);
  // If the user is found and has not cashed out yet
  if (userBetIndex !== -1) {
    const userBet = allBetResponse[userBetIndex];
    // Calculate the cashed out amount (for simplicity, let's assume it's the amount multiplied by the current multiplier)
    const cashedOutAmount = userBet.amount * multipliers;
    // Remove the user's bet from the normalBet array
    allBetResponse.splice(userBetIndex, 1);
    console.log('user winning amount: ', cashedOutAmount);
    console.log('userBet: ', userBet);
    const user_id = userBet.userId;
    const game_id = userBet.gameId;
    await betModel.updateMany(
      { userId: user_id, gameId: game_id },
      { profit: cashedOutAmount, payout: multipliers },
    );
    const data = await walletModel.findOne({
      userId: new mongoose.Types.ObjectId(user_id),
    });

    let Amount = data.amount;
    let userId = data.userId;

    await walletModel.findOneAndUpdate(
      { userId },
      { amount: Amount + cashedOutAmount },
    );
    const obj = {
      succes: true,
      cashOutAmount: cashedOutAmount,
    };
    return obj;
    // TODO: You might want to update the user's balance or perform other related tasks here
  } else {
    // Handle the case where the user is not found or has already cashed out
    console.error(
      `User with ID ${userId} not found or has already cashed out.`,
    );
    const obj = {
      succes: false,
    };
    return obj;
  }
};

export const gameResultUpdater = async (newGameNumber) => {
  const gameAmountInput = 100000;
  const gameHashInput = 'exampledssdhash';
  const gameSaltInput = 'exampefrflesalt';
  let prevHash = null;
  for (let i = 0; i < gameAmountInput; i++) {
    let hash = String(
      prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHashInput,
    );
    hashX.push(hash);
    gameResult(hash, gameSaltInput, newGameNumber);
    prevHash = hash;
  }
  resultX = resultX.reverse();
  hashX = hashX.reverse();
  console.log('Game hash data', hashX);
  console.log('Game data', resultX);
};

const gameResult = async (seed, salt, newGameNumber) => {
  const nBits = 52; // number of most significant bits to use
  if (salt) {
    const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
    seed = hmac.toString(CryptoJS.enc.Hex);
  }
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);
  let X = r / Math.pow(2, nBits);
  X = parseFloat(X.toPrecision(9));
  X = 99 / (1 - X);
  const result = Math.floor(X);
  // console.log(Math.max(1, result / 100));
  resultX.push(Math.max(1, result / newGameNumber).toFixed(2));
  // resultx.push(2);
  return Math.max(1, result / newGameNumber);
};
