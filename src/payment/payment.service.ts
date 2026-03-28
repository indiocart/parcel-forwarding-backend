import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { Order, OrderStatus } from '../order/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createPaymentLink(orderId: number, amount: number, currency: string = 'USD') {
    console.log('🔵 createPaymentLink called with:', { orderId, amount, currency });
    
    // First, check if order exists
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    console.log('📦 Order found:', order);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    // Generate a mock payment link (replace with Wise/Stripe later)
    const mockPaymentLink = `https://wise.com/pay/mock/${orderId}/${Date.now()}`;
    
    const payment = this.paymentRepository.create({
      orderId,
      amount,
      currency,
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      paymentLink: mockPaymentLink,
    });
    
    console.log('💳 Payment to create:', payment);
    
    const savedPayment = await this.paymentRepository.save(payment);
    console.log('✅ Payment saved with ID:', savedPayment.id);
    
    return {
      paymentId: savedPayment.id,
      paymentLink: mockPaymentLink,
      amount,
      currency,
      instructions: `Please transfer ${amount} ${currency} to:\nBank: Mock Bank\nAccount: 123456789\nReference: ORDER-${orderId}`,
    };
  }

  async markPaymentCompleted(paymentId: number, transactionReference: string) {
    console.log('🔵 markPaymentCompleted called with:', { paymentId, transactionReference });
    
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });
    
    console.log('💳 Payment found:', payment);
    
    if (!payment) throw new Error('Payment not found');
    
    payment.status = PaymentStatus.COMPLETED;
    payment.transactionReference = transactionReference;
    payment.paidAt = new Date();
    await this.paymentRepository.save(payment);
    
    console.log('✅ Payment updated, updating order:', payment.orderId);
    
    // Update order payment status
    await this.orderRepository.update(
      { id: payment.orderId },
      { paymentStatus: true, status: OrderStatus.PURCHASED }
    );
    
    console.log('✅ Order updated');
    
    return payment;
  }

  async getOrderPayments(orderId: number) {
    console.log('🔵 getOrderPayments called for orderId:', orderId);
    
    const payments = await this.paymentRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
    
    console.log('💰 Payments found:', payments.length);
    
    return payments;
  }
}