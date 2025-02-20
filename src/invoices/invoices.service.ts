import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../schemas/invoices.schema';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { Product } from '../schemas/products.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const productos = await this.productModel
      .find({
        _id: { $in: createInvoiceDto.products.map((p) => p.product_id) },
      })
      .exec();

    if (!productos || productos.length === 0) {
      throw new NotFoundException('Productos no encontrados');
    }

    const total = createInvoiceDto.products.reduce((acc, product) => {
      const producto = productos.find((p) => p.id === product.product_id);
      if (producto) {
        return acc + producto.price * product.quantity;
      }
      return acc;
    }, 0);

    const invoice = new this.invoiceModel({
      user_id: createInvoiceDto.user_id,
      products: createInvoiceDto.products,
      total: total,
      date: createInvoiceDto.date || new Date(),
    });

    return await invoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findById(id).exec();
  }
}
