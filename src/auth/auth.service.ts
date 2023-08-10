import { HttpException, Injectable } from '@nestjs/common';
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
    const findEmail = await this.authModel.findOne({ email: email });
    if (!findEmail) {
      const signup = new this.authModel({
        name,
        email,
        password,
      });

      const wallet = await this.walletModel.create({ amount: 1000 });
      signup.walletId = wallet._id.toString();
      await signup.save();

      throw new HttpException(
        { message: 'Signup successfully', signup, token },
        201,
      );
    }
    throw new HttpException({ message: 'User already signed!!' }, 200);
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
      throw new HttpException(
        { message: 'Email or password not match !!' },
        200,
      );
    }
    throw new HttpException(
      { message: 'login successfully', login, token },
      200,
    );
  }
}
