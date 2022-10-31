import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NewOrderService } from './microservices/newOrder/newOrder.service';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const newOrderService = app.get<NewOrderService>(NewOrderService);
  const configService = app.get(ConfigService)

  app.connectMicroservice(newOrderService.getOptions(configService.get('rbmq.new_order_queue')))

  await app.startAllMicroservices();
  
  await app.listen(configService.get('app.port'));
}
bootstrap();
