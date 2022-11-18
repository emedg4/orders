import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { DUMMY1, DUMMY2, DUMMY3, DUMMY4, DUMMY5, INFORMER, LIST_ORDERS, UNPAID_ORDERS } from "./constant/services";
import { ListOrders } from "./dto/listOrders";
import { CreateOrder } from "./dto/createOrder";
import { Order } from "./schema/order.schema";
import { MoldService } from "src/mold/mold.service";
import { OrdersModel } from "./orders.model";
import { ErrorCodes } from "./enums/errorCodes";
import { FINALIZADOS, INGRESADOS, PAGADO } from "./constant/Estatus";
import { QueueSteps } from "./dto/queueSteps.dto";
import { ModifyOrder } from "./dto/modifyOrder.dto";


@Injectable()
export class OrdersService {
    private logger: Logger;
    constructor( private moldService: MoldService, private ordersModel: OrdersModel,
        @Inject( LIST_ORDERS ) private listOrdersClient: ClientProxy,
        @Inject( DUMMY1 ) private dummy1Client: ClientProxy,
        @Inject( DUMMY2 ) private dummy2Client: ClientProxy,
        @Inject( DUMMY3 ) private dummy3Client: ClientProxy,
        @Inject( DUMMY4 ) private dummy4Client: ClientProxy,
        @Inject( DUMMY5 ) private dummy5Client: ClientProxy,
        @Inject( INFORMER ) private informerClient: ClientProxy,

        @Inject( UNPAID_ORDERS ) private unpaidOrdersClient: ClientProxy,
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

            const saveOrder = await this.ordersModel.create(order)

            this.logger.log(`Order saved. Order: ${order.pedido}`)
            
            this.sendToQueue(order);

            return saveOrder;     
        }
    }
    
    async getAllOrders(){
        return this.ordersModel.find();
    }

    async deleteOrders(data){
        return this.ordersModel.deleteAll(data);
    }

    public async modifyOrder(data: ModifyOrder) {
        let order = await this.ordersModel.findOne({pedido: data.pedido});
        if(order == null){
            return 4000
        }

        let isFinished;
        
        
        order.steps.forEach((value, index, array) => {
            if(value.queue == data.queue){
                array[index].done = true
                order.status_principal = data.status
            }
            isFinished = value.done
        });

        if(isFinished){
            order.status_principal = FINALIZADOS;
        }

        const modifiedOrder = {
            steps: order.steps,
            status_principal: order.status_principal
        }
        const pedido = order.pedido;
        const modelModified = await this.ordersModel.findOneAndUpdate({ pedido }, modifiedOrder)
        if(order.status_principal == FINALIZADOS){
            return
        }
        else{
            this.sendToQueue(order)

        }
        


    }

    listOrders(data: ListOrders) {

        this.listOrdersClient.emit("listOrders", data);
        this.logger.log("Listando orden al Microservicio de listado.");

        return
    }

    sendToQueue(data: Order) {
        let nextQueue;
        console.log(data.steps)

        for (let index = 0; index < data.steps.length; index++) {
            const element = data.steps[index];

            if(element.done == false){
                nextQueue = element.queue;
                break;
            }

        }



        // data.steps.map ( async (value) => {
            
        //     if(value.done == false){
        //         nextQueue = value.queue;
        //     }

        // })
        console.log(nextQueue)
                switch (nextQueue) {
                    case DUMMY1:
                       this.dummy1Client.emit(nextQueue, data) 
                        break;

                    case DUMMY2:
                       this.dummy2Client.emit(nextQueue, data) 
                        break;

                    case DUMMY3:
                       this.dummy3Client.emit(nextQueue, data) 
                        break;

                    case DUMMY4:
                       this.dummy4Client.emit(nextQueue, data) 
                        break;

                    case DUMMY5:
                        this.dummy5Client.emit(nextQueue, data) 
                            break;

                    case UNPAID_ORDERS:
                        this.unpaidOrdersClient.emit(nextQueue, data)
                        break;
                    case undefined:
                        break;                                   

                    default:
                        break;
                }

                const messageToInformer = {
                    pedido: data.pedido,
                    paso: `Pedido pasando por del microservicio de ordenes a la cola  --${nextQueue}--`,
                }

                this.informerClient.emit(INFORMER, messageToInformer )

                this.logger.log(`Enviando pedido a la cola de: RMQ-Queue: --${nextQueue}--.`)
                return

            }
        
    }
