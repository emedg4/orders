import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { LIST_ORDERS, UNPAID_ORDERS } from "./constant/services";
import { ListOrders } from "./dto/listOrders";
import { CreateOrder } from "./dto/createOrder";
import { Order } from "./schema/order.schema";
import { MoldService } from "src/mold/mold.service";
import { Tenant } from "./dto/tenant.dto";
import { Mold } from "src/mold/schema/mold.schema";
import { OrdersModel } from "./orders.model";
import { ErrorCodes } from "./enums/errorCodes";
import { INGRESADOS } from "./constant/Estatus";



@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor( private moldService: MoldService, private ordersModel: OrdersModel,
        @Inject( LIST_ORDERS ) private listOrdersClient: ClientProxy,
        @Inject( UNPAID_ORDERS ) private unpaidOrdersClient: ClientProxy,
    ){
        this.logger = new Logger(OrdersService.name);
    }

    async createNewOrder(data: CreateOrder ){
        const mold = await this.moldService.findOne(data.tenant);

        if(mold == null){
            return ErrorCodes.TENANTDOESNOTEXIST;
        }
        else{
            const order: Order = new Order();
            order.pedido = data.pedido
            order.cliente = data.cliente;
            order.fecha_creacion = Date();
            order.metodo_envio = data.metodo_envio;
            order.metodo_pago = data.metodo_pago;
            order.status_principal = INGRESADOS;
            order.tienda = data.tienda;
            order.vitrina = data.vitrina;
            order.tenant = mold.tenant;
            order.steps = mold.steps;

            const saveOrder = await this.ordersModel.create(order)

            this.logger.log(`Order saved. Order: ${order}`)

            return saveOrder;     
        }
    }
    
    async getAllOrders(){
        return this.ordersModel.find();
    }

    async modifyOrderStatus(data) {


        }

    listOrders(data: ListOrders) {

        this.listOrdersClient.emit("listOrders", data);
        this.logger.log("Listando orden al Microservicio de listado.");

        return
    }

    sendToQueue(data: CreateOrder) {

        this.unpaidOrdersClient.emit(UNPAID_ORDERS, data)
        this.logger.log(`Enviando pedido al microservicio de pedidos sin pagar.`)

        return
    }
}