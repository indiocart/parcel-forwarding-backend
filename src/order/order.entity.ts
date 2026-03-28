import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusLog } from './order-status-log.entity';

export enum OrderStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ESTIMATION_SENT = 'estimation_sent',
  AWAITING_PAYMENT = 'awaiting_payment',
  PURCHASED = 'purchased',
  RECEIVED_AT_WAREHOUSE = 'received_at_warehouse',
  PACKING = 'packing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MIXED = 'mixed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.ONLINE,
  })
  orderType: OrderType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedTotalCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalTotalCost: number;

  @Column({ default: false })
  consolidationRequested: boolean;

  @Column({ default: false })
  paymentStatus: boolean;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => OrderStatusLog, (log) => log.order)
  statusLogs: OrderStatusLog[];
}