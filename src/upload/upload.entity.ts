import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column({ nullable: true })
  orderId: number;

  @Column({ nullable: true })
  orderItemId: number;

  @Column()
  userId: number;

  @Column({ default: false })
  isProcessed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}