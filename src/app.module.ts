import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PlanetModule } from './planet/planet.module';
@Module({
  imports: [HealthModule, PlanetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
