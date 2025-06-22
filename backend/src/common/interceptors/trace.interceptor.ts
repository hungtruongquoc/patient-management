import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { TraceService } from '../services/trace.service';
import { logContext } from '../logging/log-context';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  constructor(private readonly traceService: TraceService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Extract trace ID from headers (common conventions)
    const traceId =
      request.headers['x-trace-id'] ||
      request.headers['x-request-id'] ||
      request.headers['x-correlation-id'] ||
      (request.headers['traceparent'] as string)?.split('-')[1]; // W3C Trace Context

    if (traceId) {
      this.traceService.setTraceId(traceId as string);
    }

    // Add trace ID to response headers
    response.setHeader('X-Trace-ID', this.traceService.getTraceId());

    // Set traceId in AsyncLocalStorage context
    return logContext.run({ traceId: this.traceService.getTraceId() }, () =>
      next.handle(),
    );
  }
}
