import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NewOrderModule } from '../microservices/newOrder/newOrder.module';
import { ListOrdersModule } from '../microservices/listOrders/listOrders.module';
import { ORDERS, LIST_ORDERS, MODIFY_ORDERS, TO_ORDERS_ENGINE } from './constant/services'
import { OrdersService } from './orders.service';
import { ModifyOrderMicroserviceModule } from 'src/microservices/modifyOrder/modifyOrderMicroservice.module';
import { MoldModule } from 'src/mold/mold.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrdersModel } from './orders.model';
import { OrderLifeCycleModule } from 'src/microservices/orderLifeCycle/orderLifeCycle.module';



@Module({
    imports: [MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}]),

        MoldModule,
    
    NewOrderModule.register({
                    name: ORDERS
                }),
    ModifyOrderMicroserviceModule.register({
                    name: MODIFY_ORDERS
    }),
    OrderLifeCycleModule.register({
        name: TO_ORDERS_ENGINE
    })
            ],
    controllers: [ OrdersController ],
    providers: [ OrdersService, OrdersModel ]

})
export class OrdersModule {}