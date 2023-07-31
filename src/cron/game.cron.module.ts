import { Module } from '@nestjs/common';
import { GameCronService } from './game.cron.service';

@Module({
  providers: [GameCronService],
})
export class GameCronModule {}
