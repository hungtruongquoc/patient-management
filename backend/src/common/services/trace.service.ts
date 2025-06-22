import { Injectable, Scope } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable({ scope: Scope.REQUEST })
export class TraceService {
  private traceId: string;

  constructor() {
    this.traceId = randomUUID();
  }

  getTraceId(): string {
    return this.traceId;
  }

  setTraceId(traceId: string): void {
    this.traceId = traceId;
  }

  // Helper method for structured logging
  getTraceContext(): { traceId: string; timestamp: string } {
    return {
      traceId: this.traceId,
      timestamp: new Date().toISOString(),
    };
  }
}
