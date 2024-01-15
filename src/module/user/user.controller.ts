import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import type {
  SignInInput,
  SignUpInput,
} from "../../interfaces/user.interfaces";
import encryption from "../../utils/encryption";
import jwt from "../../utils/jwt";

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

  @Post("signin")
  public async signIn(@Body() payload: SignInInput) {
    const { email, password } = await this.uservalidation.signInInput(payload);

    const user = await this.userService.findOneByEmail(email);
    if (!user || !encryption.compareHash(password, user.password))
      throw new UnauthorizedException("invalid email/password");

    return {
      message: "success",
      data: jwt.createToken({ _id: user._id }),
    };
  }
}
