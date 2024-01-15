import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'follows' })
export class Follow {
  @Prop({ required: true, type: Types.ObjectId })
  public userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  public targetId: Types.ObjectId;
}

export type FollowDocument = Document & Follow;

export const FollowSchema = SchemaFactory.createForClass(Follow);
