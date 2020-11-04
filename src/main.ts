import { NestFactory } from '@nestjs/core';
import { BadGatewayException, Logger, ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
import { generateTypeormConfigFile, setDefaultUser } from './scripts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Se implementa el config antes que el logger,
  // para poder saber el entorno en el que nos encontramos.
  const config = app.get(ConfigService);
  const logger = new Logger(config.get<string>('NODE_ENV').toUpperCase());

  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 3000;

  initSwagger(app); // ¿Queremos implementar Swagger solo en desarrollo o no?
  setDefaultUser(config);
  generateTypeormConfigFile(config);

  // Enable CORS to specific whilelist of allowed domains
  // const allowedDomains = [
  //   'http://localhost:4200'
  // ]
  app.enableCors({
    credentials: true,
    // if you enable whitelist uncomment the following commented lines
    // origin: (origin, cb) => {
    //   (allowedDomains.indexOf(origin) !== -1)
    //     ? cb(null, true)
    //     : cb(new BadGatewayException('Not allowd by CORS'))
    // },
    origin: '*', // if you enable whitelist comment or delete this line
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  logger.verbose(`Server is running at ${await app.getUrl()}`);
}
bootstrap();
