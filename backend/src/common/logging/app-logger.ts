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
  private static sanitizeForLogging(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitizedData = { ...data };

    // Remove known PII fields
    const piiFields = [
      'email',
      'firstName',
      'lastName',
      'phone',
      'ssn',
      'dateOfBirth',
      'address',
    ];

    piiFields.forEach((field: string) => {
      if (field in sanitizedData) {
        delete sanitizedData[field];
      }
    });

    if (
      sanitizedData.errorMessage &&
      typeof sanitizedData.errorMessage === 'string'
    ) {
      sanitizedData.error = this.sanitizeErrorMessages(
        sanitizedData.error as string,
      );
    }

    Object.keys(sanitizedData).forEach((key: string) => {
      if (
        typeof sanitizedData[key] === 'object' &&
        sanitizedData[key] !== null
      ) {
        sanitizedData[key] = this.sanitizeForLogging(
          sanitizedData[key] as Record<string, unknown>,
        );
      }
    });

    return sanitizedData;
  }

  private static sanitizeErrorMessages(message: string): string {
    return message
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        'REDACTED_EMAIL',
      )
      .replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '[SSN_REDACTED]') // SSN patterns
      .replace(/\b\d{10,}\b/g, '[PHONE_REDACTED]'); // Phone number;
  }

  static info(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    const sanitizedMeta = this.sanitizeForLogging(meta);
    globalLogger.info({ ...sanitizedMeta, traceId }, message);
  }

  static error(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    const sanitizedMeta = this.sanitizeForLogging(meta);
    globalLogger.error({ ...sanitizedMeta, traceId }, message);
  }

  static warn(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    const sanitizedMeta = this.sanitizeForLogging(meta);
    globalLogger.warn({ ...sanitizedMeta, traceId }, message);
  }

  static debug(message: string, meta: Record<string, unknown> = {}) {
    const ctx = logContext.getStore();
    const traceId = ctx?.traceId;
    const sanitizedMeta = this.sanitizeForLogging(meta);
    globalLogger.debug({ ...sanitizedMeta, traceId }, message);
  }
}
