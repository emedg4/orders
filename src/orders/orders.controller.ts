import { Controller, Get, Logger,  } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrdersExceptions } from 'src/Exceptions/ordersExceptions';
import { ModifyOrderMicroserviceService } from 'src/microservices/modifyOrder/modifyOrderMicroservice.service';
import { NewOrderService } from '../microservices/newOrder/newOrder.service';
import { MODIFY_ORDERS_QUEUE, NEW_ORDER_QUEUE } from './constant/queues';
import { GET_ORDERS } from './constant/uris';
import { CreateOrder } from './dto/createOrder';
import { ErrorCodes } from './enums/errorCodes';

import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
    private logger: Logger;
    constructor(
        private readonly modifyOrderMicroserviceService: ModifyOrderMicroserviceService,
        private readonly newOrderService: NewOrderService,
        private readonly ordersService: OrdersService){
        this.logger = new Logger(OrdersController.name);
    }

    @EventPattern(NEW_ORDER_QUEUE)
    async getNewOrder(@Payload() data: CreateOrder, @Ctx() context: RmqContext){

        const createdOrder = await this.ordersService.createNewOrder(data);

        if(createdOrder == ErrorCodes.TENANTDOESNOTEXIST){
            const error = await new OrdersExceptions(OrdersService.name, "createNewOrder")
            this.logger.log(await error.tenantDoesntExist(data.tenant))
            this.newOrderService.ack(context);

            return
        }

        this.newOrderService.ack(context);
        return

    }

    @EventPattern(MODIFY_ORDERS_QUEUE)
    async modifyOrderStatus(@Payload() data, @Ctx() context: RmqContext) {
        
    }

    @Get(GET_ORDERS)
    async getAllOrders(){
        return this.ordersService.getAllOrders()
    }

    
}