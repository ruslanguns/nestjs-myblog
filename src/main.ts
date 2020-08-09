import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')
  const port = 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );


  await app.listen(port);
  logger.log(`Server is running at ${await app.getUrl()}`)
}
bootstrap();
