import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RmqContext } from "@nestjs/microservices";
import { CreateNewOrder } from "./dto/createNewOrder";
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from "./entities/orders.entity";
import { Repository } from 'typeorm';
import { LIST_ORDERS } from "./constant/services";
import { PAGADO, SINPAGAR } from "./constant/Estatus"
import { ListOrders } from "./dto/listOrders";



@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor(
        @Inject( LIST_ORDERS ) private listOrdersClient: ClientProxy,
        @InjectRepository(OrdersEntity) private ordersRepository: Repository<OrdersEntity>
    ){
        this.logger = new Logger(OrdersService.name);
    }

    async createNewOrder(data: CreateNewOrder, context: RmqContext): Promise<string> {
        const newOrder: OrdersEntity = new OrdersEntity();
        newOrder.Cliente = data.cliente;
        newOrder.FechaCreacion = data.fecha_creacion;
        newOrder.FechaModificacion = data.fecha_creacion;
        newOrder.MetodoEnvio = data.metodo_envio;
        newOrder.MetodoPago = data.metodo_pago;
        newOrder.Pedido = data.pedido;
        newOrder.Tienda = data.tienda;
        newOrder.Vitrina = data.vitrina;
        newOrder.EstatusPago = data.estatus_pago;

        const orderObj = this.ordersRepository.create(newOrder);
        const createdOrder: OrdersEntity = await this.ordersRepository.save(orderObj)

        this.logger.log(data, "Created a new order into Database");

        let estatus: string;
        if(createdOrder.EstatusPago == "Pagado"){
            estatus = PAGADO
            
            return estatus
        }
        else {
            estatus = SINPAGAR
            
            return estatus
        }

        
    }
    
    async getAll(): Promise<Array<OrdersEntity>> {
        const orders: Array<OrdersEntity> = await this.ordersRepository.find(); 

        this.logger.log(JSON.stringify(orders), "Getting all orders")

        return orders
    }

    listNewOrders(data: ListOrders) {

        this.listOrdersClient.emit("listOrders", data);
        this.logger.log(data, "Listando orden al Microservicio de listado.");

        return
    }
}