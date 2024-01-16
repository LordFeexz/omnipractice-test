import { Controller, Post, HttpCode, Req, Body, Get } from "@nestjs/common";
import type { Request } from "express";
import { MessageService } from "./message.service";
import { MessageValidation } from "./message.validation";
import encryption from "../../utils/encryption";
import { MessageGateway } from "./message.gateway";

@Controller("message")
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageValidation: MessageValidation,
    private readonly messageGateway: MessageGateway
  ) {}

  @Post()
  @HttpCode(201)
  public async publishMessage(@Req() req: Request, @Body() payload: any) {
    const { message } = await this.messageValidation.createMessageValidation(
      payload
    );
    const { _id } = req.userCtx._doc;

    const newMsg = await this.messageService.createOne(_id, message);
    this.messageGateway.publishMessage(newMsg, _id);

    return {
      message: "success",
      data: {
        ...(newMsg as any)._doc,
        message: encryption.decrypt(newMsg.message),
      },
    };
  }

  @Get()
  public async getAllMyMessage(@Req() req: Request) {
    const { _id } = req.userCtx._doc;
    const friendList = await this.messageService.getFriendList(_id);

    return {
      message: "OK",
      data: await this.messageService.getMessages(
        friendList.map((el) => el._id)
      ),
    };
  }
}
