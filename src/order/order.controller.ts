import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Request() req, @Body() orderData: any) {
    return this.orderService.createOrder(req.user.userId, orderData);
  }

  @Post(':orderId/items')
  addItem(
    @Request() req,
    @Param('orderId') orderId: number,
    @Body() itemData: any,
  ) {
    return this.orderService.addItemToOrder(orderId, req.user.userId, itemData);
  }

  @Get()
  findAll(@Request() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }

  @Get(':orderId')
  findOne(@Request() req, @Param('orderId') orderId: number) {
    return this.orderService.getOrderById(orderId, req.user.userId);
  }

  @Put(':orderId/submit')
  submit(@Request() req, @Param('orderId') orderId: number) {
    return this.orderService.submitOrder(orderId, req.user.userId);
  }

  @Get(':orderId/timeline')
  getTimeline(@Request() req, @Param('orderId') orderId: number) {
    return this.orderService.getOrderTimeline(orderId, req.user.userId);
  }
}