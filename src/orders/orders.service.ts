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
          'Deleted Product',
        unitPrice: productMap.get(p.product_id.toString())?.price || 0,
        quantity: p.quantity,
      })),
    }));
  }

  async getAllOrdersWithDetails(userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can access this data');
    }

    const oneMonthAgo = moment().subtract(30, 'days').toDate();

    // Obtener todas las órdenes completadas en los últimos 30 días
    const orders = await this.orderModel.find({
      status: 'completed',
      date: { $gte: oneMonthAgo },
    });

    // Obtener los ids únicos de usuarios y productos
    const userIds = [
      ...new Set(orders.map((order) => order.user_id.toString())),
    ];
    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.products.map((p) => p.product_id.toString()),
        ),
      ),
    ];

    // Obtener usuarios y productos en paralelo
    const [users, products] = await Promise.all([
      this.userModel.find({ _id: { $in: userIds } }),
      this.productModel.find({ _id: { $in: productIds } }),
    ]);

    // Crear mapas para acceso rápido
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user._id.toString(), user.name);
    });

    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product.id.toString(), {
        name: product.name,
        price: product.price,
      });
    });

    // Retornar las órdenes con detalles ampliados
    return orders.map((order) => ({
      orderId: order._id.toString(),
      user: {
        id: order.user_id.toString(),
        name: userMap.get(order.user_id.toString()) || 'Deleted User',
      },
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
