import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('all-users-purchases-last-month')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllUsersPurchases() {
    return {
      purchases: await this.ordersService.getAllUsersPurchasesLastMonth(),
    };
  }
}
