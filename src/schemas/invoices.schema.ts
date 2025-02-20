import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true })
  user_id: string;

  @Prop({
    type: [{ product_id: { type: String }, quantity: { type: Number } }],
  })
  products: { product_id: string; quantity: number }[];

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  date: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
