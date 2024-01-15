import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { UserService } from '../../module/user/user.service';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ParseToUser implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  public async transform(value: string) {
    if (!isValidObjectId(value))
      throw new BadRequestException('invalid objectId');

    return await this.userService.findOneById(new Types.ObjectId(value));
  }
}
