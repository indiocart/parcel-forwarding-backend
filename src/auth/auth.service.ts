import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(fullName: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(fullName, email, hashedPassword);
  }

  async login(email: string, password: string) {
  console.log('🔵 Login attempt for email:', email);
  
  const user = await this.usersService.findByEmail(email);
  console.log('🔵 User found:', user ? 'Yes' : 'No');

  if (!user) throw new UnauthorizedException('Invalid credentials');

  console.log('🔵 Stored password hash:', user.password);
  console.log('🔵 Comparing with password:', password);
  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('🔵 Password match:', isMatch);
  
  if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  const payload = { userId: user.id, email: user.email };

  return {
    access_token: this.jwtService.sign(payload),
  };
}
}