import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MessageDocument } from "../../models/message.schema";
import type { DbOpts } from "../../interfaces";
import encryption from "../../utils/encryption";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel("messages")
    private readonly messageRepo: Model<MessageDocument>
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
}
