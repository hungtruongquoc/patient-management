import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite dev server + backend
    credentials: true,
  });
  
  await app.listen(3000);
}

void bootstrap();
