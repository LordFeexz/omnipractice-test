import { UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import jwt from '../../utils/jwt';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';
import { FollowService } from '../user/follow.service';
import { UserDocument } from '../../models/user.schema';
import { Message, MessageDocument } from '../../models/message.schema';
import { config } from 'dotenv';

config();

@WebSocketGateway(parseInt(process.env.SOCKET_PORT) ?? 3001)
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}

  @WebSocketServer()
  private server: Server;
  private onlineUser = new Set<UserDocument>();

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers['authorization'];
    if (!token) {
      client.disconnect();
      throw new UnauthorizedException('invalid token');
    }

    const { _id } = jwt.verifyToken(token);
    const user = await this.userService.findOneById(new Types.ObjectId(_id));
    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('invalid token');
    }

    this.onlineUser.add(user);
    const friendList = await this.userService.findMultipleByIds(
      (await this.followService.getUserFollower(user._id)).map(
        (el) => el.userId,
      ),
    );
    const list = friendList.map((el) => el._id);
    this.getOnlineUser(
      Array.from(this.onlineUser).filter(({ _id }) => list.includes(_id)),
    );
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers['authorization'];
    if (!token) client.disconnect();

    const { _id } = jwt.verifyToken(token);
    this.onlineUser.forEach((el) => {
      if (_id.toString() === el._id.toString()) this.onlineUser.delete(el);
    });
    client.disconnect();
  }

  private getOnlineUser(userLists: UserDocument[]) {
    this.server.emit('user-online', userLists);
  }

  @SubscribeMessage('message')
  public handleMessage(client: Socket, payload: Message) {
    const token = client.handshake.headers['authorization'];
    if (!token) client.disconnect();
    jwt.verifyToken(token);
    return payload;
  }

  public publishMessage(message: MessageDocument) {
    return this.server.emit('message', message);
  }
}
