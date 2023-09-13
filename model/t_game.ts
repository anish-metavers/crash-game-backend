import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema({
  timestamps: true,
  collection: 't_game',
})
export class Game {
  @Prop({ defaultValue: 1000 })
  crashId: number;

  @Prop({ type: mongoose.Types.Decimal128 })
  gameCrashNumber: mongoose.Types.Decimal128;

  @Prop()
  gameStatus: string;

  @Prop({ type: Date, defaultValue: new Date() })
  time: Date;

  @Prop()
  isBetActive: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
