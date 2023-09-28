import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    logger: console,
  });

  if (process.env.PREFIX) {
    app.setGlobalPrefix(process.env.PREFIX);
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 86400,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3000;
  const message = `Server running \n in ${process.env.NODE_ENV} mode on ${port} port \n at http://localhost:${port}`;

  await app.listen(port).then(() => {
    console.log(message);
  });
}
bootstrap();
