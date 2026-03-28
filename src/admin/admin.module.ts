import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { UsersModule } from '../users/users.module';
import { Order } from '../order/order.entity';
import { OrderItem } from '../order/order-item.entity';
import { OrderStatusLog } from '../order/order-status-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderStatusLog]), UsersModule],
  providers: [AdminService, AdminGuard],
  controllers: [AdminController],
  exports: [AdminGuard],
})
export class AdminModule {}