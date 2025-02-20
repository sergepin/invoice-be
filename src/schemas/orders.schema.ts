import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, type: [{ product_id: String, quantity: Number }] })
  products: { product_id: string; quantity: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'cancelled'] })
  status: string;

  @Prop({ required: true, type: Date })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
