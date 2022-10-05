import { Controller, Get } from '@nestjs/common';
import { version } from 'process';

@Controller({ path: '/health', version: '1' })
export class HealthController {
  @Get()
  check(): string {
    return 'Everything is OK';
  }
}
