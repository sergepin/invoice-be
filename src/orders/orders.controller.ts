import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { Request } from 'express';
import { RequestUser } from 'src/interface/request-user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('user-purchases')
  @UseGuards(AuthGuard('jwt'))
  async getUserPurchases(
    @Query('userId') targetUserId: string,
    @Req() req: Request & { user: RequestUser },
  ) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id: userId, role: userRole } = req.user;

    return {
      purchases: await this.ordersService.getUserPurchases(
        userId,
        targetUserId,
        userRole,
      ),
    };
  }

  @Get('all-users-purchases-last-month')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllUsersPurchases() {
    return {
      purchases: await this.ordersService.getAllUsersPurchasesLastMonth(),
    };
  }
}
