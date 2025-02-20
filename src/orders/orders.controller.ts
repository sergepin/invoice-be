import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { QueryPurchasesDto } from '../dto/query-purchases.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('user-purchases-last-month')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getUserPurchases(@Query() query: QueryPurchasesDto) {
    return {
      purchases: await this.ordersService.getUserPurchasesLastMonth(
        query.userId,
      ),
    };
  }
}
