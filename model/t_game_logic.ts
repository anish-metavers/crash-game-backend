import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameLogicDocument = HydratedDocument<GameLogic>;

@Schema({
  timestamps: true,
  collection: 't_game_logic',
})
export class GameLogic {
  @Prop()
  gameNumber: number;
}

export const GameLogicSchema = SchemaFactory.createForClass(GameLogic);
