import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'] || 'unknown';

    // Log request start
    this.logger.info('Request started', {
      method,
      url,
      ip,
      userAgent,
      type: 'request_start',
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log successful request
          this.logger.logRequest(method, url, duration, statusCode);
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log error
          this.logger.error('Request failed', {
            method,
            url,
            duration: `${duration}ms`,
            statusCode,
            error: error.message,
            stack: error.stack,
            type: 'request_error',
          });
        },
      }),
    );
  }
}
