import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${port}`);

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing app...');
    await app.close();
  });
}
bootstrap();
