import {
  SubscribeMessage,
  WebSocketGateway,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  WebSocketServer,
  type OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import jwt from '../../utils/jwt';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';
import { UserDocument } from '../../models/user.schema';
import { Message, MessageDocument } from '../../models/message.schema';
import { config } from 'dotenv';
import { MessageService } from './message.service';

config();

@WebSocketGateway(8080, { namespace: 'chat' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  afterInit(server: Socket) {
    console.log(server);
  }

  @WebSocketServer()
  private server: Server;
  private onlineUser = new Set<UserDocument>();

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client);
    const token = client.handshake.headers['authorization'];
    if (!token) client.disconnect();

    const { _id } = jwt.verifyToken(token as string);
    const user = await this.userService.findOneById(new Types.ObjectId(_id));
    if (!user) {
      client.disconnect();
      return;
    }

    this.onlineUser.add(user);
    const friendList = await this.messageService.getFriendList(user._id);
    const list = friendList.map((el) => el._id);
    this.getOnlineUser(
      Array.from(this.onlineUser).filter(({ _id }) => list.includes(_id)),
    );
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers['authorization'];
    if (!token) {
      client.disconnect();
      return;
    }

    const { _id } = jwt.verifyToken(token as string);
    this.onlineUser.forEach((el) => {
      if (_id.toString() === el._id.toString()) this.onlineUser.delete(el);
    });
    client.disconnect();
  }

  private getOnlineUser(userLists: UserDocument[]) {
    this.server.emit('user-online', userLists);
  }

  @SubscribeMessage('chat')
  public handleMessage(client: Socket, payload: Message) {
    const token = client.handshake.headers['authorization'];
    if (!token) {
      client.disconnect();
      return;
    }
    jwt.verifyToken(token as string);
    return payload;
  }

  public publishMessage(message: MessageDocument) {
    return this.server.emit('message', message);
  }
}
