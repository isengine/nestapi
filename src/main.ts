import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import redoc from 'redoc-express';
import { join } from 'path';
import { AppModule } from '@src/app.module';
import * as cookieParser from 'cookie-parser';
import * as fileStore from 'session-file-store';
import * as passport from 'passport';
import * as session from 'express-session';

const FileStoreSession = fileStore(session);

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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

  if (process.env.SWAGGER_PREFIX) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || '')
      .setDescription(process.env.SWAGGER_DESCRIPTION || '')
      .setVersion(process.env.SWAGGER_VERSION || '')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(process.env.SWAGGER_PREFIX, app, swaggerDocument);
  }

  if (process.env.SWAGGER_PREFIX_REDOC) {
    const redocConfig = {
      title: process.env.SWAGGER_TITLE || '',
      version: process.env.SWAGGER_VERSION || '',
      specUrl: `/${process.env.SWAGGER_PREFIX}-json`,
    };
    app.use(`/${process.env.SWAGGER_PREFIX_REDOC}`, redoc(redocConfig));
  }

  console.log('SESSION_EXPIRES', Number(process.env.SESSION_EXPIRES));

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: Number(process.env.SESSION_EXPIRES) || -3600,
      },
      store: new FileStoreSession({}),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/static'));
  app.setViewEngine('ejs');

  const port = process.env.PORT || 5000;
  const message = `Server running \n in ${process.env.NODE_ENV} mode on ${port} port \n at http://localhost:${port}`;

  await app.listen(port).then(() => {
    console.log(message);
  });
}
bootstrap();
