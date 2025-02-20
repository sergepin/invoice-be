import {
  IsString,
  IsArray,
  IsISO8601,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductOrder {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}

export class CheckoutDto {
  @IsString()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrder)
  products: ProductOrder[];

  @IsISO8601()
  date: string;
}
