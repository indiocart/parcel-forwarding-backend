import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🟡 JwtGuard.canActivate called');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('🔴 JwtGuard.handleRequest - err:', err, 'user:', user, 'info:', info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}