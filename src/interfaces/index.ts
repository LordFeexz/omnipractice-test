import type { ClientSession } from "mongoose";

export interface DbOpts {
  session?: ClientSession;
}
