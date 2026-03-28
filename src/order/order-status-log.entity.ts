import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.statusLogs, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  orderId: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}