import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { create } from "domain";
import { Tenant } from "src/orders/dto/tenant.dto";
import { MOLD } from "./constant/uris";
import { MoldService } from "./mold.service";

@Controller(MOLD)
export class MoldController {
    private logger: Logger;
    constructor( private moldService: MoldService,){
        this.logger = new Logger(MoldController.name)
    }

    @Get(':tenant')
    async getMold(@Param('tenant') tenant: string) {
        return this.moldService.findOne(tenant)
    }

    @Get()
    async getallMolds(){
        return this.moldService.find();
    }

    @Post()
    async createMold(@Body() createMold: Tenant) {
        return this.moldService.createMold(createMold)
    }

}