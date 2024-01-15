import type { SignUpInput } from "../../interfaces/user.interfaces";
import BaseValidation from "../../base/validation.base";
import * as yup from "yup";

export class UserValidation extends BaseValidation {
  public async signupInput(data: any) {
    return await this.validate<SignUpInput>(
      yup
        .object()
        .shape({
          username: yup.string().required("username is required"),
          email: yup
            .string()
            .required("email is required")
            .email("invalid email format"),
          password: yup
            .string()
            .required("password is required")
            .test(this.passwordValidation),
          confirmPassword: yup.string().required("confirmPassword is required"),
        })
        .test(
          "is same",
          "password and confirmPassword doesnt match",
          ({ password, confirmPassword }) => password === confirmPassword
        ),
      data
    );
  }
}