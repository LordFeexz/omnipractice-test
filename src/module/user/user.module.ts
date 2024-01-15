import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Userschema } from "../../models/user.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "users",
        schema: Userschema,
      },
    ]),
  ],
  providers: [UserService, UserValidation],
  controllers: [UserController],
})
export class UserModule {}
