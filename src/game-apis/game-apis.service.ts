import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'model/t_auth';
import { Game, GameDocument } from 'model/t_game';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { Model } from 'mongoose';
import { CreateGameApiDto } from './dto/create-game-api.dto';
import { UpdateGameApiDto } from './dto/update-game-api.dto';

@Injectable()
export class GameApisService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) { }
  
  // create(createGameApiDto: CreateGameApiDto) {
  //   return { message: 'Pay out updated successfully' };
  // }

  async findAllGameList() {
    const gameList = await this.gameModel.find();
    return { message: 'Game all list', gameList };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} gameApi`;
  // }

  update(id: number, updateGameApiDto: UpdateGameApiDto) {
    return `This action updates a #${id} gameApi`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} gameApi`;
  // }
}
