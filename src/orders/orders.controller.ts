import { Body, Controller, Get, Logger, Query } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { fsyncSync } from 'fs';
import { ModifyOrderMicroserviceService } from 'src/microservices/modifyOrder/modifyOrderMicroservice.service';
import { NewOrderService } from '../microservices/newOrder/newOrder.service';
import { CreatedOrder } from './dto/createdOrder';
import { CreateNewOrder } from './dto/createNewOrder';
import { GetOrdersDTO } from './dto/getOrders';
import { ListOrders } from './dto/listOrders';
import { ModifyOrderStatusDTO } from './dto/modifyOrderStatus';
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

    @EventPattern("newOrder")
    async getNewOrder(@Payload() data: CreateNewOrder, @Ctx() context: RmqContext){
        try {
            const order: CreatedOrder = await this.ordersService.createNewOrder(data, context);
            this.newOrderService.ack(context)

            const listOrders: ListOrders = { actual: order.status, previo: null}
            this.ordersService.listOrders(listOrders);
            if(data.estatus_pago == "Sin Pagar"){
                this.ordersService.sendToUnpaidOrdersQueue(order);
            }
            return;
            
        } catch (error) {
            this.logger.error(error)       
        }
    }

    @EventPattern("Modify_Orders")
    async modifyOrderStatus(@Payload() data: ModifyOrderStatusDTO, @Ctx() context: RmqContext) {
        try {
            const orderToList = await this.ordersService.modifyOrderStatus(data)
            this.modifyOrderMicroserviceService.ack(context)
            if(orderToList !== null){
                this.ordersService.listOrders(orderToList)
                return
            }
            this.logger.log(`Pedido ${data.pedido} Cambio a ${data.status.status}`)
            return;
            
        } catch (error) {
            this.logger.error(error)

            return;
        }

    }

    @Get("getOrders")
    async getAllOrders(): Promise<GetOrdersDTO[]>{
        try {
            const allOrders = await this.ordersService.getAll();
            return allOrders
            
        } catch (error) {
            this.logger.error(error)
        }
    }
    /**
     * Service consumed by ListORders
     * @param query 
     * @returns 
     */
    @Get("getByFilter")
    async getByStatusFilter(@Query() query: any) {
        try {
            const filtrado = await this.ordersService.getByStatusFilter(query);
            
            return filtrado

        } catch (error) {
            this.logger.error(error)
            
            return
        }
    }

    @Get("getByHeavyFilter")
    async getByHeavyFilter(@Body() body: any) {
        try {
            const filtrado = await this.ordersService.getByHeavyFilter(body);
            
            return filtrado

        } catch (error) {
            this.logger.error(error)
            
            return
        }        
    }
}