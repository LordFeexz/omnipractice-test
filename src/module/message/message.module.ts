import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../../models/message.schema';
import { MessageController } from './message.controller';
import { Authentication } from '../../middlewares/authentication';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { UserService } from '../user/user.service';
import { FollowService } from '../user/follow.service';
import { Userschema } from '../../models/user.schema';
import { FollowSchema } from '../../models/follow.schema';
import { MessageValidation } from './message.validation';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'messages',
        schema: MessageSchema,
      },
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
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageGateway,
    UserService,
    FollowService,
    MessageValidation,
  ],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).forRoutes({
      path: '/message',
      method: RequestMethod.ALL,
    });
  }
}
