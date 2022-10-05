import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BearerGuard } from './security/bearer.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  // SECURITY
  app.useGlobalGuards(new BearerGuard(configService));

  // VERSIONNING
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //-------- SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Form Earth to Moon API')
    .setDescription('A codelab to discover NestJs and more')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //------- IN & OUT
  // Enables global behaviors on incoming DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only expose attributes wille be accepted on incoming DTO
      transform: true, // Automatically converts attributes from incoming DTO when possible
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Enables global behaviors on outgoing entities
  // For examples, @Exclude decorators will be processed
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000);
}
bootstrap();
