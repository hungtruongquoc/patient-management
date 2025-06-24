import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform incoming data to DTO types
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for extra properties
      disableErrorMessages: false, // Keep detailed error messages
    }),
  );
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite dev server + backend
    credentials: true,
  });

  await app.listen(3000);
}

void bootstrap();
