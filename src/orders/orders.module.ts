import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './entities/orders.entity';
import { OrdersController } from './orders.controller';
import { NewOrderModule } from '../microservices/newOrder/newOrder.module';
import { ListOrdersModule } from '../microservices/listOrders/listOrders.module';
import { ORDERS, LIST_ORDERS, MODIFY_ORDERS, UNPAID_ORDERS } from './constant/services'
import { OrdersService } from './orders.service';
import { ModifyOrderMicroserviceModule } from 'src/microservices/modifyOrder/modifyOrderMicroservice.module';
import { UnpaidOrderMicroserviceModule } from 'src/microservices/unpaidOrders/unpaidOrders.module';


@Module({
    imports: [ TypeOrmModule.forFeature([OrdersEntity]),
    
    NewOrderModule.register({
                    name: ORDERS
                }),
    ListOrdersModule.register({
                    name: LIST_ORDERS
    }),
    ModifyOrderMicroserviceModule.register({
                    name: MODIFY_ORDERS
    }),
    UnpaidOrderMicroserviceModule.register({
                    name: UNPAID_ORDERS
    }),
            ],
    controllers: [ OrdersController ],
    providers: [ OrdersService ]

})
export class OrdersModule {}