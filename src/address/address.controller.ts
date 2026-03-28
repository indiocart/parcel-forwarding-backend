import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('address')
@UseGuards(JwtGuard)
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  create(@Request() req, @Body() addressData: any) {
    return this.addressService.createAddress(req.user.userId, addressData);
  }

  @Get()
  findAll(@Request() req) {
    return this.addressService.getUserAddresses(req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: number, @Body() addressData: any) {
    return this.addressService.updateAddress(id, req.user.userId, addressData);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: number) {
    return this.addressService.deleteAddress(id, req.user.userId);
  }

  @Put(':id/default')
  setDefault(@Request() req, @Param('id') id: number) {
    return this.addressService.setDefaultAddress(id, req.user.userId);
  }
}