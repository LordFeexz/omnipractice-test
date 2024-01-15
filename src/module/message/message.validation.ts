import { Injectable } from "@nestjs/common";
import BaseValidation from "../../base/validation.base";
import * as yup from "yup";

@Injectable()
export class MessageValidation extends BaseValidation {
  public async createMessageValidation(data: any) {
    return await this.validate<{ message: string }>(
      yup.object().shape({
        message: yup.string().required("message is required"),
      }),
      data
    );
  }
}
