import { Injectable } from '@nestjs/common';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthDocument } from 'model/t_auth';
import { Wallet, WalletDocument } from 'model/t_wallet';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  //USER SIGNUP APIs
  async signupUser(createSignup: SignupDto) {
    const { name, email, password } = createSignup;
    const token = jwt.sign(
      {
        email,
      },
      'secret',
      { expiresIn: '1h' },
    );
    try {
      const signup = new this.authModel({
        name,
        email,
        password,
      });

      const wallet = await this.walletModel.create({ amount: 1000 });
      signup.walletId = wallet._id.toString();
      await signup.save();

      return {
        message: 'Signup successfully',
        signup,
        token: token,
      };
    } catch (error) {
      return {
        error: true,
        success: false,
        message: 'User already signup',
      };
    }
  }

  //USER LOGIN APIs
  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const token = jwt.sign(
      {
        email,
      },
      'secret',
      { expiresIn: '1h' },
    );
    const login = await this.authModel.findOne({
      email: email,
      password: password,
    });
    if (!login) {
      return {
        message: 'Email or password not match',
      };
    }
    return {
      success: true,
      error: false,
      message: 'Login successfully',
      token,
    };
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
