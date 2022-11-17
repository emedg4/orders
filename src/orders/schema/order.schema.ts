import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { QueueSteps } from "../dto/queueSteps.dto";
import { Tenant } from "../dto/tenant.dto";

export type OrdersDocument = Order & Document;

@Schema()
export class Order {
    @Prop()
    pedido: string;

    @Prop()
    fecha_creacion: string;

    @Prop()
    metodo_pago: string;

    @Prop()
    tienda: string;

    @Prop()
    metodo_envio: string;

    @Prop()
    cliente: string;

    @Prop()
    vitrina: string;

    @Prop()
    status_principal: string;

    @Prop()
    tenant: String;

    @Prop()
    steps: QueueSteps[]


}

export const OrderSchema = SchemaFactory.createForClass(Order)