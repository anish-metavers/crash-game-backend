import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GameCronModule } from './cron/game.cron.module';
import { BettingModule } from './betting/betting.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/CrashDB'),
    AuthModule,
    BettingModule,
    GameModule,
    // GameCronModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
