import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MessageDocument } from "../../models/message.schema";
import type { DbOpts } from "../../interfaces";
import encryption from "../../utils/encryption";
import { FollowService } from "../user/follow.service";
import { UserService } from "../user/user.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel("messages")
    private readonly messageRepo: Model<MessageDocument>,
    private readonly followService: FollowService,
    private readonly userService: UserService
  ) {}

  public async createOne(
    senderId: Types.ObjectId,
    message: string,
    opts?: DbOpts
  ) {
    const msg = new this.messageRepo({
      message: encryption.encrypt(message),
      senderId,
    });
    return await msg.save({ ...opts });
  }

  public async getFriendList(_id: Types.ObjectId) {
    return await this.userService.findMultipleByIds(
      (await this.followService.getUserFollower(_id)).map((el) => el.userId)
    );
  }

  public async getMessages(ids: Types.ObjectId[]) {
    return await this.followService.getFollowedMessages(ids);
  }
}
