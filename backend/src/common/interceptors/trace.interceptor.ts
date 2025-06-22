import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { logContext } from '../logging/log-context';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Check if this is an HTTP context
    const contextType = context.getType();
    let traceId: string;

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      // Extract trace ID from headers (common conventions)
      traceId =
        (request.headers['x-trace-id'] as string) ||
        (request.headers['x-request-id'] as string) ||
        (request.headers['x-correlation-id'] as string) ||
        (request.headers['traceparent'] as string)?.split('-')[1] || // W3C Trace Context
        randomUUID(); // Generate new trace ID if none provided

      // Add trace ID to response headers
      response.setHeader('X-Trace-ID', traceId);
    } else {
      // For GraphQL and other contexts, generate a new trace ID
      traceId = randomUUID();
    }

    // Set traceId in AsyncLocalStorage context
    return logContext.run({ traceId }, () => next.handle());
  }
}
