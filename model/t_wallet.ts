import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({
  timestamps: true,
  collection: 't_wallet',
})
export class Wallet {
  @Prop({ type:mongoose.Types.Decimal128, defaultValue:1000})
  amount: mongoose.Types.Decimal128
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);