import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type BettingDocument = HydratedDocument<Betting>;

@Schema({
  timestamps: true,
  collection: 't_betting',
})
export class Betting {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: '' })
  round: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  amount: string;

  @Prop({ type: mongoose.Types.Decimal128, defaultValue: 100 })
  auto_cut: mongoose.Types.Decimal128;

  @Prop({ type: mongoose.Types.Decimal128 })
  crash_out: mongoose.Types.Decimal128;

  @Prop({ type: mongoose.Types.Decimal128 })
  result: mongoose.Types.Decimal128;

  @Prop({ defaultValue: true })
  active: boolean;
}

export const BettingSchema = SchemaFactory.createForClass(Betting);
