import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NewOrderModule } from '../microservices/newOrder/newOrder.module';
import { ListOrdersModule } from '../microservices/listOrders/listOrders.module';
import { ORDERS, LIST_ORDERS, MODIFY_ORDERS, UNPAID_ORDERS, DUMMY1, DUMMY2, DUMMY3, DUMMY4, INFORMER, DUMMY5 } from './constant/services'
import { OrdersService } from './orders.service';
import { ModifyOrderMicroserviceModule } from 'src/microservices/modifyOrder/modifyOrderMicroservice.module';
import { UnpaidOrderMicroserviceModule } from 'src/microservices/unpaidOrders/unpaidOrders.module';
import { MoldModule } from 'src/mold/mold.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { OrdersModel } from './orders.model';
import { Dummy1MicroserviceModule } from 'src/microservices/dummyMicroservices/dummy1/dummy1Ms.module';
import { Dummy2MicroserviceModule } from 'src/microservices/dummyMicroservices/dummy2/dummy2Ms.module';
import { Dummy3MicroserviceModule } from 'src/microservices/dummyMicroservices/dummy3/dummy3Ms.module';
import { Dummy4MicroserviceModule } from 'src/microservices/dummyMicroservices/dummy4/dummy4Ms.module';
import { Dummy5MicroserviceModule } from 'src/microservices/dummyMicroservices/dummy5/dummy5Ms.module';
import { InformerMicroserviceModule } from 'src/microservices/dummyMicroservices/informer/informerMs.module';


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
    Dummy1MicroserviceModule.register({
                    name: DUMMY1
    }),
    Dummy2MicroserviceModule.register({
                    name: DUMMY2
    }),
    Dummy3MicroserviceModule.register({
                     name: DUMMY3
    }),
    Dummy4MicroserviceModule.register({
                    name: DUMMY4
    }),
    Dummy5MicroserviceModule.register({
                    name: DUMMY5
    }),
    InformerMicroserviceModule.register({
                    name: INFORMER
    }),
            ],
    controllers: [ OrdersController ],
    providers: [ OrdersService, OrdersModel ]

})
export class OrdersModule {}