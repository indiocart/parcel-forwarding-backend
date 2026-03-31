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
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body('status') status: string,
    @Body('message') message?: string,
  ) {
    console.log('🔵 AdminController.updateOrderStatus called:', { orderId, status, message });
    const result = await this.adminService.updateOrderStatus(orderId, status as any, message);
    console.log('✅ AdminController.updateOrderStatus result:', result);
    return result;
  }

  @Put('orders/:orderId/payment')
  togglePayment(
    @Param('orderId') orderId: number,
    @Body('paymentStatus') paymentStatus: boolean,
  ) {
    return this.adminService.togglePaymentStatus(orderId, paymentStatus);
  }

  @Put('payments/:paymentId/complete')
  completePayment(
    @Param('paymentId') paymentId: number,
    @Body('transactionReference') transactionReference: string,
  ) {
    return this.adminService.completePayment(paymentId, transactionReference);
  }
}