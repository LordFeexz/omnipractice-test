import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Userschema } from '../../models/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { FollowSchema } from '../../models/follow.schema';
import { FollowService } from './follow.service';
import { Authentication } from '../../middlewares/authentication';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'users',
        schema: Userschema,
      },
      {
        name: 'follows',
        schema: FollowSchema,
      },
    ]),
  ],
  providers: [UserService, UserValidation, FollowService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authentication)
      .forRoutes({ path: '/user/:userId', method: RequestMethod.PATCH });
  }
}
