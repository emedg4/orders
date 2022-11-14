import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RmqContext } from "@nestjs/microservices";
import { CreateNewOrder } from "./dto/createNewOrder";
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from "./entities/orders.entity";
import { Repository } from 'typeorm';
import { LIST_ORDERS, UNPAID_ORDERS } from "./constant/services";
import { INGRESADOS, SINPAGAR, PAGADO, ENPREPARACION, ENDESPACHO, CANCELADOS, FINALIZADOS } from "./constant/Estatus"
import { ListOrders } from "./dto/listOrders";
import { GetOrdersDTO } from "./dto/getOrders";
import { ModifyOrderStatusDTO } from "./dto/modifyOrderStatus";
import { CreatedOrder } from "./dto/createdOrder";



@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor(
        @Inject( LIST_ORDERS ) private listOrdersClient: ClientProxy,
        @Inject( UNPAID_ORDERS ) private unpaidOrdersClient: ClientProxy,
        @InjectRepository(OrdersEntity) private ordersRepository: Repository<OrdersEntity>
    ){
        this.logger = new Logger(OrdersService.name);
    }

    async createNewOrder(data: CreateNewOrder, context: RmqContext): Promise<CreatedOrder> {
        const esPedidoPagado: boolean = data.estatus_pago == PAGADO ? true : false;
        
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
        newOrder.EstatusPedido = INGRESADOS;

        //Crear en la base de datos la nueva orden
        const orderObj = this.ordersRepository.create(newOrder);
        const createdOrder: OrdersEntity = await this.ordersRepository.save(orderObj)

        this.logger.log("Created a new order into Database");
        
        const response: CreatedOrder = {
            status: createdOrder.EstatusPedido,
            pedido: createdOrder.Pedido,
            tienda: createdOrder.Tienda,
            vitrina: createdOrder.Vitrina,
            cliente: createdOrder.Cliente,
            fechaCreacion: createdOrder.FechaCreacion
            
        }
        return response;
    }

    async modifyOrderStatus(data: ModifyOrderStatusDTO): Promise<ListOrders> {

        if(data.status.status == INGRESADOS){
            const modified = await this.ordersRepository.update({Pedido: data.pedido}, {EstatusPago: data.status.nuevo})
            console.log(`webos`)
            return null;
        }

        if(data.status.status == ENPREPARACION || ENDESPACHO || FINALIZADOS || CANCELADOS ){
            const orderToList: ListOrders = {
                actual: data.status.nuevo,
                previo: data.status.previo
            }
            this.logger.log("Order Modified")
            await this.ordersRepository.update({Pedido: data.pedido}, {EstatusPedido: data.status.nuevo})

            return orderToList;
        }


    }

    async getByStatusFilter( filter: any ) {

        const filtrado = await this.ordersRepository.findBy({ EstatusPedido: filter.filtro });

        this.logger.log(`Logueando por el filtro ${filter}`, "getByFilter")

        return filtrado;
    }

    async getByHeavyFilter(filter: any ) {
        const filtered = await this.ordersRepository.findBy(filter);

        this.logger.log(`Filtered by ${filter}`)

        return filtered;
    }
    
    async getAll(): Promise<Array<OrdersEntity>> {
        const orders: Array<OrdersEntity> = await this.ordersRepository.find(); 

        this.logger.log("Getting all orders")

        return orders
    }

    listOrders(data: ListOrders) {

        this.listOrdersClient.emit("listOrders", data);
        this.logger.log("Listando orden al Microservicio de listado.");

        return
    }

    sendToUnpaidOrdersQueue(data: CreatedOrder) {

        this.unpaidOrdersClient.emit("Unpaid_Orders", data)
        this.logger.log(`Enviando pedido al microservicio de pedidos sin pagar.`)

        return
    }
}