import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NewOrderModule } from '../microservices/newOrder/newOrder.module';
import { ListOrdersModule } from '../microservices/listOrders/listOrders.module';
import { ORDERS, LIST_ORDERS, MODIFY_ORDERS, UNPAID_ORDERS } from './constant/services'
import { OrdersService } from './orders.service';
import { ModifyOrderMicroserviceModule } from 'src/microservices/modifyOrder/modifyOrderMicroservice.module';
import { UnpaidOrderMicroserviceModule } from 'src/microservices/unpaidOrders/unpaidOrders.module';
import { MoldModule } from 'src/mold/mold.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrdersModel } from './orders.model';


@Module({
    imports: [MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}]),

        MoldModule,
    
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
    providers: [ OrdersService, OrdersModel ]

})
export class OrdersModule {}