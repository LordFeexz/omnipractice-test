import {
  type ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    if (exception.message.includes('E11000 duplicate')) {
      httpStatus = HttpStatus.CONFLICT;
      const match = exception.message.match(/index: (\w+)_\d+/);
      const fieldName = match ? match[1] : null;

      if (fieldName) message = `${fieldName} is already registered.`;
    }

    if (httpStatus === 500) console.log(exception);
    ctx.getResponse<Response>().status(httpStatus).json({ message });
  }
}
