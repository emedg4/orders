import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { QueueSteps } from "src/orders/dto/queueSteps.dto";

export type MoldDocument = Mold & Document;
@Schema()
export class Mold{

    @Prop()
    tenant: string;
    
    @Prop()
    status_principal: string;

    @Prop()
    steps: QueueSteps[]

}

export const MoldSchema = SchemaFactory.createForClass(Mold)