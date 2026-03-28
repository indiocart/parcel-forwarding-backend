import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('payments')
@UseGuards(JwtGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create/:orderId')
  createPayment(
    @Request() req,
    @Param('orderId') orderId: number,
    @Body('amount') amount: number,
    @Body('currency') currency: string = 'USD',
  ) {
    return this.paymentService.createPaymentLink(orderId, amount, currency);
  }

  @Get('order/:orderId')
  getOrderPayments(@Request() req, @Param('orderId') orderId: number) {
    return this.paymentService.getOrderPayments(orderId);
  }
}