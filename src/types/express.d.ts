import { UserDocument } from "../../models/user.schema";

declare global {
  namespace Express {
    interface Request {
      userCtx: UserDocument;
    }
  }
}

export {};
