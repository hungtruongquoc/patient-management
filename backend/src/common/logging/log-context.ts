import { AsyncLocalStorage } from 'async_hooks';

export interface LogContext {
  traceId?: string;
}

export const logContext = new AsyncLocalStorage<LogContext>();
