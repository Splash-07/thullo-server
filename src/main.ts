import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm/out';
import { getRepository } from 'typeorm';
import { Session } from './modules/auth/entities/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getRepository(Session);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
      store: new TypeormStore({
        cleanupLimit: 2,
      }).connect(sessionRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(5000);
}
bootstrap();
