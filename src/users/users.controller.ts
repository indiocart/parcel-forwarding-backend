import { Controller, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      message: 'You are authenticated',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    };
  }
}