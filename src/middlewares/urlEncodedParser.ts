import { type NestMiddleware } from '@nestjs/common';
import { urlencoded } from 'body-parser';

export class UrlEncodedParser implements NestMiddleware {
  use = urlencoded({ extended: true });
}