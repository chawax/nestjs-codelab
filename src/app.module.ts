import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetModule } from './planet/planet.module';
import { StarshipModule } from './starship/starship.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {          
          type: 'sqlite',
          database: configService.get('SQL_MEMORY_DB_SHARED'),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: true
        } as TypeOrmModuleOptions;
      },
    }),    
    PlanetModule, 
    StarshipModule, 
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
