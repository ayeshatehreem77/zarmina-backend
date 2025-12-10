import {
  Controller, Get, Post, Patch, Delete, Param, Body, ValidationPipe,
  UseGuards, Request, ForbiddenException
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // ✅ Only logged-in users can create orders
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body(ValidationPipe) createOrderDto: CreateOrderDto, @Request() req) {
    // Pass full user info to service
    return this.ordersService.create(createOrderDto, req.user);
  }




  // ✅ Admins see all orders, users see their own
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    if (req.user.role === 'admin') {
      return this.ordersService.findAll();
    }
    // ✅ Use userId consistently
    return this.ordersService.findByUser(req.user.userId);
  }


  // ✅ User can view only their own orders
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }


  // ✅ User can see only their own order
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.findOne(id);
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  // ✅ Only admin can update
  // PATCH /orders/:id/status  → Admin updates status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can update orders');
    }

    return this.ordersService.updateStatus(id, status);
  }



  // ✅ Only admin can delete
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can delete orders');
    return this.ordersService.delete(id);
  }
}
