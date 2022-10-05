import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PlanetModule } from './planet/planet.module';
import { StarshipModule } from './starship/starship.module';
@Module({
  imports: [HealthModule, PlanetModule, StarshipModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
