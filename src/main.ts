import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const port = app.get(ConfigService).get<number>('app.port') ?? 3001;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<AsyncMicroserviceOptions>(
    {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.NATS,
        options: {
          servers: configService.get('transport.nats.servers'),
        },
      }),
      inject: [ConfigService],
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(port);

  const logger = new Logger('boostrap');
  logger.log(`Server (microsrv-payment) is listening on port ${port}`);
}
bootstrap();
