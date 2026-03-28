import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';  // ← IMPORT from constants

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('🟢 JwtStrategy constructor called');
    console.log('🔑 Using secret:', jwtConstants.secret); // ← DEBUG: show secret
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,  // ← USE SAME SECRET
    });
  }

  async validate(payload: any) {
    console.log('🔵 JwtStrategy.validate called with payload:', payload);
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }
}