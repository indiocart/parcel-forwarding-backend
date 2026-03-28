import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('orders/:orderId')
  getOrderById(@Param('orderId') orderId: number) {
    return this.adminService.getOrderById(orderId);
  }

  @Put('orders/:orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body('status') status: string,
    @Body('message') message?: string,
  ) {
    return this.adminService.updateOrderStatus(orderId, status as any, message);
  }
}