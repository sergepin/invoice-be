import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/purchase')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async purchase(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.purchaseProduct(id, quantity);
  }

  @Patch(':id/stock')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Patch(':id/stock/reset')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async resetStock(@Param('id') id: string) {
    return this.productsService.resetStock(id);
  }
}
