import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Logger 인스턴스 생성
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url, body, params } = ctx.getRequest<Request>();
    const reqTimestamp = new Date().toISOString();

    this.logger.log(
      `[Request] : ${reqTimestamp} | ${method} ${url} ${JSON.stringify(method === 'GET' ? params : body)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const resTimestamp = new Date().toISOString();
        this.logger.log(
          `[Response] : ${resTimestamp} | ${response.status} ${method} ${url} ${JSON.stringify(data) ?? ''}`,
        );
      }),
    );
  }
}
