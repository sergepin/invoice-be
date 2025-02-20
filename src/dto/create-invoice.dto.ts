import { IsString, IsArray, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDto {
  @IsString()
  user_id: string;

  @IsArray()
  products: { product_id: string; quantity: number }[];

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;
}
