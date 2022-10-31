import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from './rmq/rmq.service';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get(ConfigService)

  app.connectMicroservice(rmqService.getOptions(configService.get('rbmq.queue_name')))

  await app.startAllMicroservices();
  
  await app.listen(configService.get('app.port'));
}
bootstrap();
