import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class BearerGuard implements CanActivate {
  private readonly logger = new Logger(BearerGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request?.headers?.authorization === `Bearer ${this.configService.get<string>('API_BEARER')}`) {
      return true;
    }

    this.logger.warn(`An unauthorized call has been made on a API endpoint`);
    return false;
  }
}
