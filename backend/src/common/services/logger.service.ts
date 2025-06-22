import { Injectable, Scope } from '@nestjs/common';
import pino from 'pino';
import { TraceService } from './trace.service';

// Pino configuration
const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  private logger: pino.Logger;

  constructor(private readonly traceService: TraceService) {
    this.logger = pino(pinoConfig);
  }

  // Helper to get context with trace ID
  private getContext(
    meta: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      traceId: this.traceService.getTraceId(),
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }

  // Log levels
  info(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.info(this.getContext(meta), message);
  }

  error(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.error(this.getContext(meta), message);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.warn(this.getContext(meta), message);
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.logger.debug(this.getContext(meta), message);
  }

  // Specialized logging methods for common use cases
  logRequest(
    method: string,
    url: string,
    duration: number,
    statusCode: number,
  ): void {
    this.info('HTTP Request', {
      method,
      url,
      duration: `${duration}ms`,
      statusCode,
      type: 'request',
    });
  }

  logDatabase(query: string, duration: number, table?: string): void {
    this.info('Database Query', {
      query,
      duration: `${duration}ms`,
      table,
      type: 'database',
    });
  }

  logGraphQL(
    operation: string,
    duration: number,
    variables?: Record<string, unknown>,
  ): void {
    this.info('GraphQL Operation', {
      operation,
      duration: `${duration}ms`,
      variables,
      type: 'graphql',
    });
  }

  logSecurity(event: string, userId?: string, ip?: string): void {
    this.warn('Security Event', {
      event,
      userId,
      ip,
      type: 'security',
    });
  }

  logBusiness(event: string, entity: string, entityId?: string | number): void {
    this.info('Business Event', {
      event,
      entity,
      entityId,
      type: 'business',
    });
  }
}
