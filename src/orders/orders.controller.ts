import { Body, Controller, Delete, Get, Logger,  } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrdersExceptions } from 'src/Exceptions/ordersExceptions';
import { ModifyOrderMicroserviceService } from 'src/microservices/modifyOrder/modifyOrderMicroservice.service';
import { NewOrderService } from '../microservices/newOrder/newOrder.service';
import { MODIFY_ORDERS_QUEUE, NEW_ORDER_QUEUE } from './constant/queues';
import { DELETE_ORDERS, GET_ORDERS } from './constant/uris';
import { CreateOrder } from './dto/createOrder';
import { ModifiedOrder } from './dto/modifiedOrder';
import { ModifyOrder } from './dto/modifyOrder.dto';
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

        console.log("Data arrived", data)
        const createdOrder = await this.ordersService.createNewOrder(data);

        if(createdOrder == ErrorCodes.TENANTDOESNOTEXIST){
            const error = await new OrdersExceptions(OrdersService.name, "createNewOrder")
            this.logger.log(await error.tenantDoesntExist(data.tenant))
            this.newOrderService.ack(context);

            return
        }
        this.newOrderService.ack(context);
        this.ordersService.sendToOrdersEngine(createdOrder);
        
        return

    }

    @EventPattern(MODIFY_ORDERS_QUEUE)
    async modifyOrderStatus(@Payload() payload: ModifiedOrder, @Ctx() context: RmqContext) {
        this.ordersService.modifyOrder(payload);
        this.modifyOrderMicroserviceService.ack(context)
        return
        
    }

    @Get(GET_ORDERS)
    async getAllOrders(){
        return this.ordersService.getAllOrders()
    }

    @Delete(DELETE_ORDERS)
    async deleteOrders(@Body() body ){
        return this.ordersService.deleteOrders(body);
        
    }

    
}