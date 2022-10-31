import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewOrderService } from '../microservices/newOrder/newOrder.service';
import { CreateNewOrder } from './dto/createNewOrder';
import { OrdersEntity } from './entities/orders.entity';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
    private logger: Logger;
    constructor(
        private readonly newOrderService: NewOrderService,
        private readonly ordersService: OrdersService){
        this.logger = new Logger(OrdersController.name);
    }

    @EventPattern("newOrder")
    async getNewOrder(@Payload() data: CreateNewOrder, @Ctx() context: RmqContext){
        try {
            const order: OrdersEntity = await this.ordersService.createNewOrder(data, context);
            this.newOrderService.ack(context)
            return order;
            
        } catch (error) {
            this.logger.error(error)       
        }
    }

    @Get("getOrders")
    async getAllOrders(): Promise<OrdersEntity[]>{
        try {
            const allOrders = await this.ordersService.getAll();
            return allOrders
            
        } catch (error) {
            this.logger.error(error)
        }
    }
}