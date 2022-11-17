import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MoldController } from "./mold.controller";
import { MoldModel } from "./mold.model";
import { MoldService } from "./mold.service";
import { Mold, MoldSchema } from "./schema/mold.schema";

@Module({
    imports:[MongooseModule.forFeature([{name: Mold.name, schema: MoldSchema}])],
    controllers:[MoldController],
    providers:[MoldService, MoldModel],
    exports:[MoldService, MoldModel]
})
export class MoldModule {}