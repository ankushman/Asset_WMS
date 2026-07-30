import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        errorType = (res as any).error || exception.name;
      } else {
        message = res as string;
        errorType = exception.name;
      }
    } else if (exception && (exception as any).name === 'MongoServerError' && (exception as any).code === 11000) {
      status = HttpStatus.BAD_REQUEST;
      errorType = 'Duplicate Key Error';
      const keyPattern = (exception as any).keyPattern || {};
      const fields = Object.keys(keyPattern).join(', ');
      message = `Duplicate key error: Field(s) [${fields}] already exists in database.`;
    } else if (exception && (exception as any).name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      errorType = 'Mongoose Validation Error';
      message = (exception as any).message || 'Database validation failed';
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`[Unhandled Exception] ${exception.message}`, exception.stack);
    }

    const sanitizedMessage = typeof message === 'string' ? this.sanitizeMessage(message) : message;

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private sanitizeMessage(msg: string): string {
    return msg.replace(/("password"|"secret")\s*:\s*"[^"]+"/gi, '$1:"[REDACTED]"');
  }
}
