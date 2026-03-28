import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'You are authenticated',
      user: req.user,
    };
  }

}