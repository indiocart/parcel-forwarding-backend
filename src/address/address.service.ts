import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async createAddress(userId: number, addressData: Partial<Address>) {
    const address = this.addressRepository.create({
      ...addressData,
      userId,
    });
    return this.addressRepository.save(address);
  }

  async getUserAddresses(userId: number) {
    return this.addressRepository.find({ where: { userId } });
  }

  async updateAddress(addressId: number, userId: number, addressData: Partial<Address>) {
    await this.addressRepository.update({ id: addressId, userId }, addressData);
    return this.addressRepository.findOne({ where: { id: addressId, userId } });
  }

  async deleteAddress(addressId: number, userId: number) {
    await this.addressRepository.delete({ id: addressId, userId });
    return { deleted: true };
  }

  async setDefaultAddress(addressId: number, userId: number) {
    // First, unset any existing default
    await this.addressRepository.update({ userId, isDefault: true }, { isDefault: false });
    // Then set the new default
    await this.addressRepository.update({ id: addressId, userId }, { isDefault: true });
    return this.addressRepository.findOne({ where: { id: addressId, userId } });
  }
}