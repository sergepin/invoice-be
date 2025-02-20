import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/orders.schema';
import { Product, ProductDocument } from '../schemas/products.schema';
import { CheckoutDto } from '../dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async checkout(checkoutDto: CheckoutDto) {
    const { user_id, products, date } = checkoutDto;
    let totalAmount = 0;

    for (const item of products) {
      const product = await this.productModel.findById(item.product_id);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product_id} not found`,
        );
      }
      if (product.stock < item.quantity) {
        throw new ForbiddenException(
          `Insufficient stock for product ID ${item.product_id}`,
        );
      }
      product.stock -= item.quantity;
      await product.save();
      totalAmount += product.price * item.quantity;
    }

    const order = await this.orderModel.create({
      user_id,
      products,
      totalAmount,
      status: 'completed',
      date,
    });

    return order;
  }
}
