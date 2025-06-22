import pino from 'pino';
import { logContext } from './log-context';

const globalLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export class AppLogger {
  static info(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    globalLogger.info({ ...meta, traceId }, message);
  }

  static error(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    globalLogger.error({ ...meta, traceId }, message);
  }

  static warn(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    globalLogger.warn({ ...meta, traceId }, message);
  }

  static debug(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    globalLogger.debug({ ...meta, traceId }, message);
  }
}
