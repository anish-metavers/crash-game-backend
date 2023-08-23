import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'model/t_auth';
import { Model } from 'mongoose';
import { ErrorConfig } from 'utils/config';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new HttpException(
        {
          ...ErrorConfig.NO_TOKEN_FOUND,
          statusCode: 401,
        },
        401,
      );
    }
    let id: string;
    try {
      const decoded = jwt.verify(token, 'secret');
      id = decoded.id;
    } catch (error) {
      throw new HttpException(
        {
          ...ErrorConfig.INVALID_TOKEN,
          statusCode: 401,
        },
        401,
      );
    }

    const user = await this.authModel.findOne({ _id: id });
    
    if (!user)
      throw new HttpException(
        {
          ...ErrorConfig.NO_USER_FOUND,
          statusCode: 401,
        },
        401,
      );
    req['user_id'] = user.id;
    // console.log(req['user_id'], user.id);
    return true;
  }
}
