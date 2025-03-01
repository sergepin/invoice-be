import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/orders.schema';
import { User, UserDocument } from '../schemas/user.schema';
import * as moment from 'moment';
import { Product, ProductDocument } from 'src/schemas/products.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getAllUsersPurchasesLastMonth() {
    const oneMonthAgo = moment().subtract(30, 'days').toDate();

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
      const purchaseData = purchases.find(
        (p) => p._id.toString() === user._id.toString(),
      );
      return {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        totalPurchases: purchaseData ? purchaseData.totalPurchases : 0,
      };
    });
  }

  async getUserPurchases(
    userId: string,
    targetUserId: string,
    userRole: string,
  ) {
    if (userRole !== 'admin' && userId !== targetUserId) {
      throw new ForbiddenException(
        'You do not have permission to view these orders',
      );
    }
    const oneMonthAgo = moment().subtract(30, 'days').toDate();
    const orders = await this.orderModel.find({
      user_id: targetUserId,
      status: 'completed',
      date: { $gte: oneMonthAgo },
    });

    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.products.map((p) => p.product_id.toString()),
        ),
      ),
    ];

    const products = await this.productModel.find({
      _id: { $in: productIds },
    });

    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product.id.toString(), {
        name: product.name,
        price: product.price,
      });
    });

    return orders.map((order) => ({
      orderId: order._id.toString(),
      userId: order.user_id,
      totalAmount: order.totalAmount,
      date: order.date,
      products: order.products.map((p) => ({
        productId: p.product_id.toString(),
        name:
          productMap.get(p.product_id.toString())?.name ||
          'Producto no encontrado',
        unitPrice: productMap.get(p.product_id.toString())?.price || 0,
        quantity: p.quantity,
      })),
    }));
  }
}
