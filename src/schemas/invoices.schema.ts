import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true })
  user_id: string; // ID del usuario que realizó la compra

  @Prop({
    type: [{ product_id: { type: String }, quantity: { type: Number } }],
  })
  products: { product_id: string; quantity: number }[]; // Lista de productos y cantidades

  @Prop({ required: true })
  total: number; // Total de la factura

  @Prop({ required: true })
  date: Date; // Fecha de la factura
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
