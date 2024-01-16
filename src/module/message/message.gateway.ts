import {
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
import { MessageDocument } from '../../models/message.schema';
import { config } from 'dotenv';
import { MessageService } from './message.service';
import { FollowService } from '../user/follow.service';

config();

@WebSocketGateway(8080, { namespace: 'chat' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly followService:FollowService
  ) {}

  afterInit(server: Socket) {
    console.log(server);
  }

  @WebSocketServer()
  private server: Server;
  private onlineUser = new Set<string>();

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers['authorization'];
    if (!token) client.disconnect();

    const { _id } = jwt.verifyToken(token as string);
    const user = await this.userService.findOneById(new Types.ObjectId(_id));
    if (!user) {
      client.disconnect();
      return;
    }

    this.onlineUser.add(user._id.toString());
    this.getOnlineUser(await this.getFriendList(user._id));
  }

  private async getFriendList(id: Types.ObjectId) {
    const friendList = await this.followService.getFollowersList(id);
    const list = friendList.map((el) => el._id);

    return Array.from(this.onlineUser).filter((_id) => list.includes(_id));
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers['authorization'];
    if (!token) {
      client.disconnect();
      return;
    }

    const { _id } = jwt.verifyToken(token as string);
    this.onlineUser.forEach((el) => {
      if (_id.toString() === el) this.onlineUser.delete(el);
    });
    client.disconnect();
  }

  private getOnlineUser(userLists: string[]) {
    this.server.emit('user-online', userLists);
  }

  public async publishMessage(message: MessageDocument, id: Types.ObjectId) {
    const list = (await this.getFriendList(id)).map((el) => el.toString());
    return list.length ? this.server.to(list).emit('message', message) : false;
  }
}
