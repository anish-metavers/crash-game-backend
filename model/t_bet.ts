import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type BetDocument = HydratedDocument<Bet>;

@Schema({
  timestamps: false,
  collection: 't_bet',
})
export class Bet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'auth' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  walletId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  gameId: string;

  @Prop({ type: mongoose.Types.Decimal128, defaultValue: 1 })
  amount: mongoose.Types.Decimal128;

  @Prop({ type: mongoose.Types.Decimal128, defaultValue: 100 })
  payout: mongoose.Types.Decimal128;

  @Prop({ type: Date, defaultValue: new Date() })
  time: Date;

  @Prop({ type: mongoose.Types.Decimal128, defaultValue: 0 })
  profit: mongoose.Types.Decimal128;
}

export const BetSchema = SchemaFactory.createForClass(Bet);
