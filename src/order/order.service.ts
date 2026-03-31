import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, OrderType } from './order.entity';
import { OrderItem, OrderItemStatus } from './order-item.entity';
import { OrderStatusLog } from './order-status-log.entity';
import { NotFoundException } from '@nestjs/common'; 

@Injectable()
export class OrderService {
  // Allowed status transitions
  private allowedTransitions: Record<string, string[]> = {
    [OrderStatus.DRAFT]: [OrderStatus.SUBMITTED],
    [OrderStatus.SUBMITTED]: [OrderStatus.ESTIMATION_SENT, OrderStatus.CANCELLED],
    [OrderStatus.ESTIMATION_SENT]: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
    [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.PURCHASED, OrderStatus.CANCELLED],
    [OrderStatus.PURCHASED]: [OrderStatus.RECEIVED_AT_WAREHOUSE, OrderStatus.CANCELLED],
    [OrderStatus.RECEIVED_AT_WAREHOUSE]: [OrderStatus.PACKING],
    [OrderStatus.PACKING]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusLog)
    private statusLogRepository: Repository<OrderStatusLog>,
  ) {}

  private async logStatusChange(orderId: number, status: string, message?: string) {
    const log = this.statusLogRepository.create({
      orderId,
      status,
      message,
    });
    return this.statusLogRepository.save(log);
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    if (currentStatus === newStatus) {
      return; // Same status is allowed
    }
    
    const allowed = this.allowedTransitions[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowed?.join(', ') || 'none'}`
      );
    }
  }

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
    if (!order) throw new NotFoundException('Order not found');

    // Only allow adding items to draft orders
    if (order.status !== OrderStatus.DRAFT) {
      throw new BadRequestException(`Cannot add items to order with status: ${order.status}`);
    }

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

  async updateOrderStatus(orderId: number, userId: number, status: OrderStatus, message?: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Order not found');
    
    // Validate status transition
    this.validateStatusTransition(order.status, status);
    
    await this.orderRepository.update({ id: orderId, userId }, { status });
    
    // Create status log
    await this.logStatusChange(orderId, status, message);
    
    return this.orderRepository.findOne({ where: { id: orderId, userId } });
  }

  async submitOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Order not found');
    
    // Validate that order can be submitted
    if (order.status !== OrderStatus.DRAFT) {
      throw new BadRequestException(`Cannot submit order with status: ${order.status}`);
    }
    
    // Validate that order has at least one item
    const items = await this.orderItemRepository.find({ where: { orderId } });
    if (items.length === 0) {
      throw new BadRequestException('Cannot submit order with no items');
    }
    
    await this.orderRepository.update(
      { id: orderId, userId },
      { status: OrderStatus.SUBMITTED }
    );
    
    // Create status log
    await this.logStatusChange(orderId, OrderStatus.SUBMITTED, 'Order submitted by user');
    
    return this.orderRepository.findOne({ where: { id: orderId, userId } });
  }

  async getOrderTimeline(orderId: number, userId: number) {
    // First verify order belongs to user
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException('Order not found');
    
    const logs = await this.statusLogRepository.find({
      where: { orderId },
      order: { createdAt: 'ASC' },
    });
    
    return logs.map(log => ({
      status: log.status,
      message: log.message,
      timestamp: log.createdAt,
    }));
  }

  // Admin method (no userId check)
  async adminUpdateOrderStatus(orderId: number, status: OrderStatus, message?: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    
    // Validate status transition
    this.validateStatusTransition(order.status, status);
    
    await this.orderRepository.update({ id: orderId }, { status });
    
    // Create status log
    await this.logStatusChange(orderId, status, message);
    
    return this.orderRepository.findOne({ where: { id: orderId } });
  }
}