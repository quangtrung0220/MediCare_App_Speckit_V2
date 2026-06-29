import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

/**
 * Bootstrap function — application entry point.
 *
 * Configuration:
 *   - Global API prefix: /api/v1
 *   - CORS: enabled (origins controlled via env in later issues)
 *   - Port: PORT env variable, default 3001 (avoids conflict with Next.js on 3000)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix — all routes served under /api/v1/*
  app.setGlobalPrefix('api/v1');

  // Global request body validation and class transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global exception filter for standardized error formats
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS — origins will be locked down via ConfigModule in Issue #8
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 MediCare backend running on http://localhost:${port}/api/v1`);
  console.log(`❤️  Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();

