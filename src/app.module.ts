import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { PaymentModule } from './payment/payment.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'parcel_db',
    autoLoadEntities: true,
    synchronize: true,
  }),
  UsersModule,
  AuthModule,
  AddressModule,
  OrderModule,
  AdminModule,
  PaymentModule,
  UploadModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
