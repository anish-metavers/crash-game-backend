import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema({
  timestamps: true,
  collection: 't_game',
})
export class Game {
  @Prop({ type: mongoose.Types.Decimal128 })
  gameCrashNumber: mongoose.Types.Decimal128;

  @Prop()
  gameStatus: string;

  @Prop()
  time: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);
