import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Product, ProductSchema } from '../schemas/products.schema';
import { Order, OrderSchema } from '../schemas/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
