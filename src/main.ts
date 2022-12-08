import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NewOrderService } from './microservices/newOrder/newOrder.service';
import { ConfigService } from '@nestjs/config';
import { ModifyOrderMicroserviceService } from './microservices/modifyOrder/modifyOrderMicroservice.service';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const newOrderService = app.get<NewOrderService>(NewOrderService);
  const modifyOrderService = app.get<ModifyOrderMicroserviceService>(ModifyOrderMicroserviceService)
  const configService = app.get(ConfigService)

  app.connectMicroservice(newOrderService.getOptions(configService.get('rbmq.queue.new_order')))
  app.connectMicroservice(modifyOrderService.getOptions(configService.get('rbmq.queue.modify_order')))

  await app.startAllMicroservices();
  
  await app.listen(configService.get('app.port'));
}
bootstrap();
