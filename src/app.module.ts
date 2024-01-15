import {
  Module,
  type NestModule,
  type MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';
import { config } from 'dotenv';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UrlEncodedParser } from './middlewares/urlEncodedParser';

config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      waitQueueTimeoutMS: 1000 * 30,
    }),
    UserModule,
    MorganModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined', {
        skip: () => process.env.NODE_ENV === 'test',
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UrlEncodedParser).forRoutes('*');
  }
}
