import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { FollowDocument } from "../../models/follow.schema";
import type { DbOpts } from "../../interfaces";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel("follows")
    private readonly followRepo: Model<FollowDocument>
  ) {}

  public async findByTargetId(targetId: Types.ObjectId) {
    return await this.followRepo.findOne({ targetId });
  }

  public async createOne(
    userId: Types.ObjectId,
    targetId: Types.ObjectId,
    opts?: DbOpts
  ) {
    const follow = new this.followRepo({
      userId,
      targetId,
    });
    return await follow.save({ ...opts });
  }

  public async getUserFollower(userId: Types.ObjectId) {
    return await this.followRepo.find({ targetId: userId });
  }
}
