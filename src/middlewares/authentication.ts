import {
  Injectable,
  type NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../models/user.schema';
import jwt from '../utils/jwt';

@Injectable()
export class Authentication implements NestMiddleware {
  constructor(
    @InjectModel('users')
    private readonly userRepo: Model<UserDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) throw new UnauthorizedException('invalid token');

    const { _id } = jwt.verifyToken(authorization);

    const user = await this.userRepo.findById(_id);
    if (!user) throw new UnauthorizedException('invalid token');

    req.userCtx = { ...user };

    next();
  }
}
