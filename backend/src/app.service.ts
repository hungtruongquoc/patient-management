import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): {
    status: string;
    timestamp: string;
    service: string;
    version: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Patient Management API',
      version: '1.0.0',
    };
  }
}
