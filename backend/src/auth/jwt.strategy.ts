/*
 * Created: 2026-07-02
 * Purpose: Passport JWT strategy — validates Bearer token and loads user into request.
 * Owner: Quang Trung
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

export interface JwtPayload {
  sub: string;   // User UUID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Called after JWT signature is verified.
   * Loads the live user record to check isActive status.
   */
  async validate(payload: JwtPayload) {
    const user = await this.userRepo.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException('Token không hợp lệ — tài khoản không tồn tại');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa. Liên hệ quản trị viên.');
    }

    if (user.isPendingApproval) {
      throw new UnauthorizedException('Tài khoản đang chờ phê duyệt từ quản trị viên.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
