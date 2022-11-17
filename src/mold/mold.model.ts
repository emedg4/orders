import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Mold, MoldDocument } from "./schema/mold.schema";

@Injectable()
export class MoldModel {
    constructor(@InjectModel(Mold.name) private moldModel: Model<MoldDocument>){}

    async findOne(moldFilterQuery: FilterQuery<Mold>): Promise<Mold> {
        return this.moldModel.findOne(moldFilterQuery)
    }

    async find(moldFilterQuery: FilterQuery<Mold>): Promise<Mold[]> {
        return this.moldModel.find(moldFilterQuery)
    }

    async create(mold: Mold): Promise<Mold> {
        const newMold = new this.moldModel(mold);
        return newMold.save()
    }

    async findOneAndUpdate(moldFilterQuery: FilterQuery<Mold>, mold: Partial<Mold>): Promise<Mold> {
        return this.moldModel.findOneAndUpdate(moldFilterQuery, mold);
    }
}