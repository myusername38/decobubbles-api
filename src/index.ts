import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');
import helmet from 'helmet';
import { ControllersModule } from './controllers/controlers.module';

const server = express();

// const whitelist = process.env.WHITELIST.split(',');
// add decobubbles here
const whitelist = ['http://localhost:4200', 'localhost:4200'];
const corsOptions = {
  origin: (origin, callback) => {
    if (
      !whitelist ||
      whitelist.length === 0 ||
      whitelist[0] === '*' ||
      whitelist.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      // console.log(origin);
      // console.log('error');
      callback(null, true);
      /*
      callback(
        new HttpException('Not allowed by CORS', HttpStatus.UNAUTHORIZED),
      );
      */
    }
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('bubblelocatorapi api')
    .addServer('/bubblelocatorapi/us-central1/api')
    .setDescription('The api for Decobubbles')
    .setVersion(process.env.VERSION)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [ControllersModule],
  });
  SwaggerModule.setup('swagger', app, document);
}

async function createNestServer(expressInstance) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.use(helmet());
  app.setGlobalPrefix('');
  setupSwagger(app);

  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  app.use(express.json());

  return app.init();
}

createNestServer(server)
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);
