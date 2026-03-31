import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  
  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  const port = parseInt(process.env.PORT || '3001');
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();