import { Injectable, Logger } from "@nestjs/common";
import { RmqContext } from "@nestjs/microservices";
import { CreateNewOrder } from "./dto/createNewOrder";
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from "./entities/orders.entity";
import { Repository } from 'typeorm';



@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor(
        @InjectRepository(OrdersEntity) private ordersRepository: Repository<OrdersEntity>
    ){
        this.logger = new Logger(OrdersService.name);
    }

    async createNewOrder(data: CreateNewOrder, context: RmqContext): Promise<OrdersEntity> {
        const newOrder: OrdersEntity = new OrdersEntity();
        newOrder.Cliente = data.cliente;
        newOrder.FechaCreacion = data.fecha_creacion;
        newOrder.FechaModificacion = data.fecha_creacion;
        newOrder.MetodoEnvio = data.metodo_envio;
        newOrder.MetodoPago = data.metodo_pago;
        newOrder.Pedido = data.pedido;
        newOrder.Tienda = data.tienda;
        newOrder.Vitrina = data.vitrina;

        const orderObj = this.ordersRepository.create(newOrder);
        const createdOrder: OrdersEntity = await this.ordersRepository.save(orderObj)

        this.logger.log(data, "Created a new order into Database");

        return createdOrder
        
    }
    
    async getAll(): Promise<Array<OrdersEntity>> {
        const orders: Array<OrdersEntity> = await this.ordersRepository.find(); 

        this.logger.log(JSON.stringify(orders), "Getting all orders")

        return orders
    }
}