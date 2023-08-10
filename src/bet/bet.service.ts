import { HttpException, Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Bet, BetDocument } from 'model/t_bet';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from 'model/t_auth';
import { Game, GameDocument } from 'model/t_game';
import { gameStatus } from 'src/cron/game.cron.service';
import { Wallet, WalletDocument } from 'model/t_wallet';

@Injectable()
export class BetService {
  constructor(
    @InjectModel(Bet.name)
    private betModel: Model<BetDocument>,
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  //Create Bet APIs
  async create(createBetDto: CreateBetDto) {
    if (gameStatus == 'Betting Open') {
      const { gameId, userId, walletId, amount, payout } = createBetDto;
      const findBet = await this.betModel.findOne({
        gameId,
        userId,
        walletId
      });
      if (!findBet) {
        const betCreate = new this.betModel({
          gameId: gameId,
          userId: userId,
          walletId: walletId,
          amount: amount || 1,
          payout: payout || 100,
          time: new Date(),
          profit: 0.0,
        });
        await betCreate.save();
        throw new HttpException(
          { message: 'Bet Created successfully', betCreate },
          201,
        );
      } else {
        const betDel = await this.betModel.deleteOne({
          gameId: gameId,
          userId: userId,
          walletId: walletId
        });
        throw new HttpException(
          {
            message: 'Bet deleted successfully',
            betDel,
          },
          200,
        );
      }
      // const findAmount=await this.walletModel.findOne()
      // await this.walletModel.updateOne({
      //   $set: {
      //     amount: amount - amount,
      //   },
      // });

      // const auth = await this.authModel.find();
      // const game = await this.gameModel.find();
      // bet.walletId = auth[0].walletId.toString();
      // bet.userId = auth[0]._id.toString();
      // bet.gameId = game[0]._id.toString();
      // await bet.save();

      // throw new HttpException(
      //   { message: 'Bet Created successfully', bet },
      //   201,
      // );
    } else {
      throw new HttpException(
        {
          message: 'Betting Closed',
        },
        401,
      );
    }
  }

  findAll() {
    return `This action returns all bet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bet`;
  }

  //Update Bet APIs
  async update(id: string, updateBetDto: UpdateBetDto) {
    if (gameStatus == 'Betting Open') {
      const { amount, payout } = updateBetDto;

      await this.betModel.updateOne(
        { _id: id },
        {
          $set: {
            amount,
            payout,
          },
        },
      );
      throw new HttpException({ message: `Bet updated successfully` }, 200);
    } else {
      throw new HttpException({ message: `Betting Closed` }, 401);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} bet`;
  }
}
