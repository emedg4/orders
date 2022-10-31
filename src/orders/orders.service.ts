import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RmqContext } from "@nestjs/microservices";
import { CreateNewOrder } from "./dto/createNewOrder";
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from "./entities/orders.entity";
import { Repository } from 'typeorm';
import { LIST_ORDERS } from "./constant/services";
import { INGRESADOS, SINPAGAR, PAGADO } from "./constant/Estatus"
import { ListOrders } from "./dto/listOrders";
import { GetOrdersDTO } from "./dto/getOrders";
import { ModifyOrderStatusDTO } from "./dto/modifyOrderStatus";



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
        const estatus_pedido: string = data.estatus_pago == PAGADO ? INGRESADOS : SINPAGAR;
        console.log(estatus_pedido, data.estatus_pago)
        
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
        newOrder.EstatusPedido = estatus_pedido;

        const orderObj = this.ordersRepository.create(newOrder);
        const createdOrder: OrdersEntity = await this.ordersRepository.save(orderObj)

        this.logger.log(data, "Created a new order into Database");

        const status: string = createdOrder.EstatusPago == PAGADO ? INGRESADOS : SINPAGAR;
        
        return status;
    }

    async modifyOrderStatus(data: ModifyOrderStatusDTO): Promise<ListOrders> {
        const modified = await this.ordersRepository.update({Pedido: data.pedido}, {EstatusPedido: data.status_nuevo})

        this.logger.log(modified, "Order Modified")

        const orderToList: ListOrders = {
            actual: data.status_nuevo,
            previo: data.status_previo
        }

        return orderToList;
    }

    async getByFilter( filter: any ) {

        const filtrado = await this.ordersRepository.findBy({ EstatusPedido: filter.filtro });

        this.logger.log(`Logueando por el filtro ${filter}`, "getByFilter")

        return filtrado;
    }
    
    async getAll(): Promise<Array<OrdersEntity>> {
        const orders: Array<OrdersEntity> = await this.ordersRepository.find(); 

        this.logger.log(orders, "Getting all orders")

        return orders
    }

    listOrders(data: ListOrders) {

        this.listOrdersClient.emit("listOrders", data);
        this.logger.log(data, "Listando orden al Microservicio de listado.");

        return
    }
}