import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ required: true, unique: true, type: String })
  public username: string;

  @Prop({ unique: true, type: String })
  public email: string;

  @Prop({ type: String })
  public password: string;
}

export type UserDocument = Document & User

export const Userschema = SchemaFactory.createForClass(User)