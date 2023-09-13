import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CrashGameCronModule } from './game-cron/game.cron.module';
import { GameModule } from './game/game.module';
import { BetModule } from './bet-apis/bet.module';
import { GameApisModule } from './game-apis/game-apis.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/CrashDB'),
    AuthModule,
    GameModule,
    BetModule,
    CrashGameCronModule,
    GameApisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
