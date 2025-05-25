import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get<number>('app.port') ?? 3001;

  await app.listen(port);

  const logger = new Logger('boostrap');
  logger.log(`Server (microsrv-payment) is listening on port ${port}`);
}
bootstrap();
