import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../order/order.entity';
import { OrderItem } from '../order/order-item.entity';
import { OrderStatusLog } from '../order/order-status-log.entity';
import { PaymentService } from '../payment/payment.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusLog)
    private statusLogRepository: Repository<OrderStatusLog>,
    private paymentService: PaymentService,
    private orderService: OrderService,
  ) {}

  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['user', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items'],
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus, message?: string) {
    console.log('🔵 AdminService.updateOrderStatus called with:', { orderId, status, message });
    
    // Get the order first
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    console.log('🔵 Current order status:', order.status);
    console.log('🔵 New status:', status);
    
    // Update order status
    await this.orderRepository.update({ id: orderId }, { status });
    
    // Create status log
    const log = this.statusLogRepository.create({
      orderId,
      status,
      message: message || `Status changed to ${status} by admin`,
    });
    await this.statusLogRepository.save(log);
    
    console.log('✅ Status updated and log created');
    
    // Return updated order with relations
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items'],
    });
  }

  async togglePaymentStatus(orderId: number, paymentStatus: boolean) {
    await this.orderRepository.update({ id: orderId }, { paymentStatus });
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

  async getAllUsers() {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('DISTINCT "userId"')
      .getRawMany();
  }

  async completePayment(paymentId: number, transactionReference: string) {
    return this.paymentService.markPaymentCompleted(paymentId, transactionReference);
  }
}