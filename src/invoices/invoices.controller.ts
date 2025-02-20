import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
}
