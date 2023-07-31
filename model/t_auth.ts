import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({
  timestamps: true,
  collection: 't_auth',
})
export class Auth {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ defaultValue: 'user' })
  username: string;

  @Prop()
  password: string;

  @Prop({ defaultValue: true })
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  walletId: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);