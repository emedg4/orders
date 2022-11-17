import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Order, OrdersDocument } from "./schema/order.schema";

@Injectable()
export class OrdersModel {
    constructor(@InjectModel(Order.name) private ordersModel: Model<OrdersDocument>){}

    async findOne(ordersFilterQuery: FilterQuery<Order>): Promise<Order> {
        return this.ordersModel.findOne(ordersFilterQuery)
    }

    async find(): Promise<Order[]> {
        return this.ordersModel.find()
    }

    async create(order: Order): Promise<Order> {
        const newOrder = new this.ordersModel(order);
        return newOrder.save()
    }

    async findOneAndUpdate(ordersFilterQuery: FilterQuery<Order>, order: Partial<Order>): Promise<Order> {
        return this.ordersModel.findOneAndUpdate(ordersFilterQuery, order);
    }
}