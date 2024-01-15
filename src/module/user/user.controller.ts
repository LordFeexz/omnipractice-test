import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import { SignUpInput } from "../../interfaces/user.interfaces";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uservalidation: UserValidation
  ) {}

  @Post("signup")
  @HttpCode(201)
  public async signUp(@Body() payload: SignUpInput) {
    return {
      message: "success",
      data: await this.userService.createOne(
        await this.uservalidation.signupInput(payload)
      ),
    };
  }
}
