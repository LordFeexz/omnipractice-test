import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  Req,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserValidation } from './user.validation';
import type {
  SignInInput,
  SignUpInput,
} from '../../interfaces/user.interfaces';
import encryption from '../../utils/encryption';
import jwt from '../../utils/jwt';
import { type UserDocument } from '../../models/user.schema';
import { ParseToUser } from '../../base/pipes/parseToUser';
import type { Request } from 'express';
import { FollowService } from './follow.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uservalidation: UserValidation,
    private readonly followService: FollowService,
  ) {}

  @Post('signup')
  @HttpCode(201)
  public async signUp(@Body() payload: SignUpInput) {
    const data = await this.userService.createOne(
      await this.uservalidation.signupInput(payload),
    );

    return {
      message: 'success',
      data: { ...(data as any)._doc, password: undefined },
    };
  }

  @Post('signin')
  @HttpCode(200)
  public async signIn(@Body() payload: SignInInput) {
    const { email, password } = await this.uservalidation.signInInput(payload);

    const user = await this.userService.findOneByEmail(email);
    if (!user || !encryption.compareHash(password, user.password))
      throw new UnauthorizedException('invalid email/password');

    return {
      message: 'success',
      data: jwt.createToken({ _id: user._id }),
    };
  }

  @Patch('/:userId')
  @HttpCode(201)
  public async followAUser(
    @Param('userId', ParseToUser) user: UserDocument | null,
    @Req() req: Request,
  ) {
    if (!user) throw new NotFoundException('user not found');

    const { _id } = req.userCtx._doc;
    if (_id.toString() === user._id.toString())
      throw new BadRequestException('cannot self follow');

    const follow = await this.followService.findByTargetId(user._id);
    if (follow) throw new ConflictException('user has been follow');

    return {
      message: 'success',
      data: await this.followService.createOne(_id, user._id),
    };
  }
}
