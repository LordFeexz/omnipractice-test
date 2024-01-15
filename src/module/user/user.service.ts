import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { type UserDocument } from '../../models/user.schema';
import type { SignUpInput } from '../../interfaces/user.interfaces';
import encryption from '../../utils/encryption';
import type { DbOpts } from '../../interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private readonly userRepo: Model<UserDocument>,
  ) {}

  public async createOne(
    { username, email, password }: SignUpInput,
    opts?: DbOpts,
  ) {
    const user = new this.userRepo({
      username: username,
      password: encryption.hashData(password),
      email,
    });
    return await user.save({ ...opts });
  }
}
