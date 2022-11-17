import { Injectable, Logger } from "@nestjs/common";
import { INGRESADOS } from "src/orders/constant/Estatus";
import { QueueSteps } from "src/orders/dto/queueSteps.dto";
import { Tenant } from "src/orders/dto/tenant.dto";
import { MoldModel } from "./mold.model";
import { Mold } from "./schema/mold.schema";

@Injectable()
export class MoldService {
    private logger: Logger;
    constructor( private moldModel: MoldModel ){
        this.logger = new Logger(MoldService.name)

    }

    async findOne( tenant: string ){      
        return await this.moldModel.findOne({tenant})
    }

    async find() {
        return this.moldModel.find({});
    }

    async createMold( steps: Tenant){
        return this.moldModel.create({
            tenant: steps.tenant,
            status_principal: INGRESADOS,
            steps: steps.queueSteps
        });
    }

    async findOneAndUpdate( tenant: string, newSteps: QueueSteps[]){
        return this.moldModel.findOneAndUpdate({tenant: tenant}, {steps: newSteps})
    }

}

