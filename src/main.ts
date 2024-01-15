import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      allowedHeaders: [
        'Content-Type',
        'Vary',
        'Accept',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Authorization',
        'X-Requested-With',
      ],
      exposedHeaders: [
        'Content-Type',
        'Vary',
        'Accept',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Authorization',
        'X-Requested-With',
      ],
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: console,
  });

  if (process.env.PREFIX) {
    app.setGlobalPrefix(process.env.PREFIX);
  }

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: Number(process.env.SESSION_EXPIRES) || -3600,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 5000;
  const message = `Server running \n in ${process.env.NODE_ENV} mode on ${port} port \n at http://localhost:${port}`;

  await app.listen(port).then(() => {
    console.log(message);
  });
}
bootstrap();
