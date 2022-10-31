import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { NewOrderModule } from '../microservices/newOrder/newOrder.module';
import { ORDERS } from './constant/services'
import { OrdersService } from './orders.service';


@Module({
    imports: [ TypeOrmModule.forFeature([OrdersEntity]),
    NewOrderModule.register({
                    name: ORDERS
                })],
    controllers: [ OrdersController ],
    providers: [ OrdersService ]

})
export class OrdersModule {}