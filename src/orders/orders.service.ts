import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/orders.schema';
import { User, UserDocument } from '../schemas/user.schema';
import * as moment from 'moment';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAllUsersPurchasesLastMonth() {
    const oneMonthAgo = moment().subtract(30, 'days').toDate();

    // Obtener cantidad de compras por usuario
    const purchases = await this.orderModel.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $gte: oneMonthAgo },
        },
      },
      {
        $group: {
          _id: '$user_id',
          totalPurchases: { $sum: 1 },
        },
      },
    ]);

    const userIds = purchases.map((p) => p._id.toString());

    const users = await this.userModel.find({ _id: { $in: userIds } });

    return users.map((user) => {
      const purchaseData = purchases.find((p) => p._id.toString() === user._id.toString());
      return {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        totalPurchases: purchaseData ? purchaseData.totalPurchases : 0,
      };
    });
  }
}
