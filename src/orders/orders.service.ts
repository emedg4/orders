import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UNPAID_ORDERS } from "./constant/services";
import { CreateOrder } from "./dto/createOrder";
import { Order } from "./schema/order.schema";
import { MoldService } from "src/mold/mold.service";
import { OrdersModel } from "./orders.model";
import { ErrorCodes } from "./enums/errorCodes";
import { INGRESADOS, PAGADO } from "./constant/Estatus";
import { QueueSteps } from "./dto/queueSteps.dto";
import { TO_ORDERS_ENGINE } from "./constant/queues";
import { ModifiedOrder } from "./dto/modifiedOrder";

@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor( private moldService: MoldService, private ordersModel: OrdersModel,
        @Inject( TO_ORDERS_ENGINE ) private ordersEngineClient: ClientProxy,
    ){
        this.logger = new Logger(OrdersService.name);
    }

    async createNewOrder(data: CreateOrder ){
        const mold = await this.moldService.findOne(data.tenant);
        if(mold == null){
            return 4000
        }
        let steps: QueueSteps[] = mold.steps;
        if(data.estatus_pago == PAGADO){
            steps.map( async(value, index, array) => {
                if(value.queue == UNPAID_ORDERS ) {
                    steps[index].done = true
                }
            })
        }

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
            order.steps = steps;
            order.status_pago = data.estatus_pago

            await this.ordersModel.create(order)

            this.logger.log(`Order saved. Order: ${order.pedido}`)

            return order;     
        }
    }
    async sendToOrdersEngine(order: Order){
        const orderToSend: ModifiedOrder = new ModifiedOrder();
        orderToSend.order = order;
        orderToSend.emmiterData.queue = null;
        orderToSend.emmiterData.stepId = null;
        orderToSend.emmiterData.isNew = true;
        orderToSend.emmiterData.isDone = true;
        orderToSend.emmiterData.stepNumber = null;
        orderToSend.emmiterData.retry = false;


        this.ordersEngineClient.emit(TO_ORDERS_ENGINE, orderToSend)
        return
    }
    /**
     *@function getAllOrders Accessed by an endpoint. Returns data from mongodb
     * @returns {Order[]} 
     */
    async getAllOrders(){
        return this.ordersModel.find();
    }

    async deleteOrders(data){
        return this.ordersModel.deleteAll(data);
    }

    /**
     * @function modifyOrder Modifies order received from orders engine
     * @param {ModifiedOrder}
     * @returns {Order} Returns an order only for log purposes
     */
    public async modifyOrder(order: ModifiedOrder) {
        const pedido = order.order.pedido;
        return this.ordersModel.findOneAndUpdate( {pedido}, order.order )
    }
}
