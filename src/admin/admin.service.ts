import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../order/order.entity';
import { OrderItem } from '../order/order-item.entity';
import { OrderStatusLog } from '../order/order-status-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusLog)
    private statusLogRepository: Repository<OrderStatusLog>,
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
  await this.orderRepository.update({ id: orderId }, { status });
  
  // Create status log
  const log = this.statusLogRepository.create({
    orderId,
    status,
    message: message || `Status changed to ${status} by admin`,
  });
  await this.statusLogRepository.save(log);
  
  return this.orderRepository.findOne({
    where: { id: orderId },
    relations: ['user', 'items'],
  });
}

  async getAllUsers() {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('DISTINCT "userId"')
      .getRawMany();
  }
}