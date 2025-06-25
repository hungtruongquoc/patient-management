import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLogger } from './common/logging/app-logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    AppLogger.info('Health check requested', { operation: 'health.check' });
    const health = this.appService.getHealth();
    AppLogger.info('Health check completed', {
      operation: 'health.check',
      status: health.status,
      version: health.version,
    });
    return health;
  }


}
