import { Module } from '@nestjs/common';
import { GameCronService } from './game.cron.service';
import { GameModule } from 'src/game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Game, GameSchema } from 'model/t_game';
@Module({
  imports: [
    GameModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GameCronService],
})
export class GameCronModule {}
