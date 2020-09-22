import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
import {setDefaultUser, generateTypeormConfigFile} from './scripts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Se implementa el config antes que el logger,
  // para poder saber el entorno en el que nos encontramos.
  const config = app.get(ConfigService);
  const logger = new Logger(config.get<string>('NODE_ENV').toUpperCase());

  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 3000;

  initSwagger(app); // ¿Queremos implementar Swagger solo en desarrollo o no?
  setDefaultUser(config);
  generateTypeormConfigFile(config); // Generador de ormconfig.json

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  logger.verbose(`Server is running at ${await app.getUrl()}`);
}
bootstrap();
