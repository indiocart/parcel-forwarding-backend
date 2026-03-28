import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, OrderType } from './order.entity';
import { OrderItem, OrderItemStatus } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(userId: number, orderData: Partial<Order>) {
    const order = this.orderRepository.create({
      ...orderData,
      userId,
      status: OrderStatus.DRAFT,
    });
    return this.orderRepository.save(order);
  }

  async addItemToOrder(orderId: number, userId: number, itemData: Partial<OrderItem>) {
    // Verify order belongs to user
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) throw new Error('Order not found');

    const item = this.orderItemRepository.create({
      ...itemData,
      orderId,
      status: OrderItemStatus.PENDING,
    });
    return this.orderItemRepository.save(item);
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: number, userId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items'],
    });
  }

  async updateOrderStatus(orderId: number, userId: number, status: OrderStatus) {
    await this.orderRepository.update({ id: orderId, userId }, { status });
    return this.orderRepository.findOne({ where: { id: orderId, userId } });
  }

  async submitOrder(orderId: number, userId: number) {
    await this.orderRepository.update(
      { id: orderId, userId, status: OrderStatus.DRAFT },
      { status: OrderStatus.SUBMITTED },
    );
    return this.orderRepository.findOne({ where: { id: orderId, userId } });
  }
}