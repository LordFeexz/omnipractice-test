import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true, type: Types.ObjectId })
  public senderId: Types.ObjectId;

  @Prop({ required: true, type: String })
  public message: string;
}

export type MessageDocument = Document & Message;

export const MessageSchema = SchemaFactory.createForClass(Message);
