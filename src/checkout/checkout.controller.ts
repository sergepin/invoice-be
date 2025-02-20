import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from '../dto/checkout.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/guards/user.guard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async checkout(@Body() checkoutDto: CheckoutDto) {
    return this.checkoutService.checkout(checkoutDto);
  }
}
