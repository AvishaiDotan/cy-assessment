import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    process.env.NODE_ENV === 'test'
      ? {
          logger: ['error'],
        }
      : {},
  );
  app.use(cookieParser());
  
  if (process.env.NODE_ENV !== 'production' && process.env.FRONTEND_URL) {
    app.enableCors({
      origin: [process.env.FRONTEND_URL!],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    });
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
