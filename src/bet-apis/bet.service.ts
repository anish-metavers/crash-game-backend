import { HttpException, Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { Bet, BetDocument } from 'model/t_bet';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Game, GameDocument } from 'model/t_game';
import { addBetLoacal, getBetsLocal } from 'src/game-cron/game.cron.service';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { cashOut } from 'src/game-cron/game.cron.service';

@Injectable()
export class BetService {
  constructor(
    @InjectModel(Bet.name)
    private betModel: Model<BetDocument>,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  //Create Bets APIs
  async createBet(req: Request, createBetDto: CreateBetDto) {
    const user_id = req['user_id'];
    req.body['user_id'] = user_id;
    createBetDto['user_id'] = user_id;
    const game = await this.gameModel.find().sort({ _id: -1 }).limit(1);
    const isActive = game[0].isBetActive;

    if (isActive == true) {
      const { gameId, amount, payout } = createBetDto;
      const wallet = await this.walletModel.find({
        userId: new mongoose.Types.ObjectId(user_id),
      });
      const walletAmount = +wallet[0].amount;
      if (walletAmount >= amount) {
        await this.betModel.findOne({
          gameId,
        });

        const betData = getBetsLocal();
        const userBet = betData.findIndex((b) => b.userId === user_id);
        console.log('user bet', userBet);
        if (userBet !== -1) {
          throw new HttpException(
            {
              message: 'Betting already created. !',
              // betData: userBet,
              // allbets: betData,
            },
            401,
          );
        }
        const betCreate = new this.betModel({
          gameId: gameId,
          userId: user_id,
          amount: amount || 1,
          payout: payout || 100,
          time: new Date(),
          profit: 0.0,
        });
        await betCreate.save();
        addBetLoacal({
          gameId: gameId,
          userId: user_id,
          amount: amount || 1,
          payout: payout || 100,
          time: new Date(),
          profit: 0.0,
        });
        console.log('all bet response :', getBetsLocal());
        throw new HttpException(
          { message: 'Bet Created successfully.', betCreate },
          201,
        );
      } else {
        throw new HttpException({ message: 'insufficient balance. !!!!' }, 401);
      }
    } else {
      throw new HttpException(
        {
          message: 'Betting Closed',
        },
        401,
      );
    }
  }

  //Cash out APIs
  async crashOut(req: Request) {
    try {
      const user_id = req['user_id'];
      cashOut(user_id);

      throw new HttpException(
        { message: 'user_id passed successfully', user_id },
        201,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
