import { IsString, IsNumber, IsIn, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsIn(['active', 'inactive'])
  status: string;
}
