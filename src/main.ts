import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Global prefix for all routes
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Server running on: http://localhost:${port}`);
  console.log(`📖 API endpoint: http://localhost:${port}/${apiPrefix}`);
  console.log(`🔥 Environment: ${process.env.NODE_ENV || 'development'}\n`);
}

bootstrap();
