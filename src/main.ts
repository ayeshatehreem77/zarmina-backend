import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors({
    origin: process.env.FRONTEND_URL, // your React app URL
    credentials: true, // if using cookies/auth tokens
  });

    // ✅ Serve static assets
  app.use('/assets', express.static(join(__dirname, '..', '..', 'public', 'assets')));


  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
