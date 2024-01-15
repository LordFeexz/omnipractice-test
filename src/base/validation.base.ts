import * as yup from "yup";
import { BadRequestException } from "@nestjs/common";

export default abstract class BaseValidation {
  protected async validate<T = any>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new BadRequestException(
        errors?.length > 1 ? errors.join(",\n ") : errors[0]
      );
    }
  }

  protected passwordValidation(password: string) {
    const requirements = [
      {
        regex: /(?=.*[a-z])/,
        message: "Please input minimum 1 lowercase",
      },
      {
        regex: /(?=.*[A-Z])/,
        message: "Please input minimum 1 uppercase",
      },
      {
        regex: /(?=.*\d)/,
        message: "Please input minimum 1 number",
      },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: "Please input minimum 1 symbol",
      },
      { regex: /^.{8,}$/, message: "Password minimum length is 8" },
    ];
    const errors = [];

    for (const requirement of requirements)
      if (!requirement.regex.test(password)) errors.push(requirement.message);

    if (errors.length) throw { errors };

    return true;
  }
}
