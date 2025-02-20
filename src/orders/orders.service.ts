import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/orders.schema';
import * as moment from 'moment';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getUserPurchasesLastMonth(userId: string): Promise<number> {
    const oneMonthAgo = moment().subtract(1, 'months').toDate();
    return this.orderModel.countDocuments({
      user_id: userId,
      status: 'completed',
      date: { $gte: oneMonthAgo },
    });
  }
}
