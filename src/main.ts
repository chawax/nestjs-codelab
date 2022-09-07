import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, GROUP_USER } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // VERSIONNING
  app.enableVersioning({
    type: VersioningType.URI,
  });

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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {groups: [GROUP_USER]}));

  //-------- SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Form Earth to Moon API')
    .setDescription('A codelab to discover NestJs and more')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
