import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: '/health', version: '1' })
@ApiBearerAuth()
export class HealthController {
  @Get()
  check(): string {
    return 'Everything is OK';
  }
}
