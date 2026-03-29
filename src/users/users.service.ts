import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

async createUser(fullName: string, email: string, password: string) {
  // DO NOT hash here - password is already hashed by AuthService
  const user = this.usersRepository.create({
    fullName,
    email,
    password, // Use the password as-is (already hashed)
  });

  return this.usersRepository.save(user);
}

async findByEmail(email: string) {
  return this.usersRepository.findOne({ where: { email } });
}

async findById(id: number) {
  return this.usersRepository.findOne({ where: { id } });
}

}