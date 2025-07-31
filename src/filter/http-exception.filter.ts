import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url, body, params } = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${exception.message} : ${method} ${url} ${JSON.stringify(method === 'GET' ? params : body)}`,
    );

    response.status(status).send({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      method: method,
      path: url,
      body: body ?? null,
    });
  }
}
