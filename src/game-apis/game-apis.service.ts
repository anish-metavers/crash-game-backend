import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from 'model/t_game';
import { GameLogic, GameLogicDocument } from 'model/t_game_logic';
import mongoose, { Model } from 'mongoose';
import { gameResultUpdater } from 'src/game-cron/game.cron.service';
import { UpdateGameApiDto } from './dto/update-game-api.dto';
@Injectable()
export class GameApisService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(GameLogic.name)
    private gameLogicModel: Model<GameLogicDocument>,
  ) {}

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

  async updateGameLogic(id: string, updateGameApiDto: UpdateGameApiDto) {
    const { gameNumber } = updateGameApiDto;
    await this.gameLogicModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        gameNumber: gameNumber,
      },
      { new: true },
    );
    gameResultUpdater(gameNumber);
    throw new HttpException({ message: 'update successfully' }, 200);
  }
}
