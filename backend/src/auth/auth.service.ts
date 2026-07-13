/*
 * Created: 2026-07-02
 * Purpose: Authentication service — login, register, profile retrieval.
 * Owner: Quang Trung
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NotificationService } from '../notifications/notification.service';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    @Optional()
    private readonly notificationService?: NotificationService,
  ) {}

  /**
   * Authenticate a user and return a signed JWT.
   * Blocks pending-approval and inactive accounts.
   */
  async login(dto: LoginDto): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    if (user.isPendingApproval) {
      throw new UnauthorizedException(
        'Tài khoản đang chờ phê duyệt từ quản trị viên. Vui lòng đợi.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa. Liên hệ quản trị viên để được hỗ trợ.');
    }

    // Update last login timestamp
    await this.userRepo.update(user.id, {
      lastLoginAt: new Date().toISOString(),
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Register a new user account (requires admin approval before login).
   */
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email này đã được sử dụng bởi một tài khoản khác.');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.userRepo.save(
      this.userRepo.create({
        email: dto.email,
        passwordHash,
        role: dto.role ?? 'PATIENT',
        isActive: true,
        isPendingApproval: true,
      }),
    );

    // 🔔 Notify admin of new pending user account
    this.notificationService?.emit({
      event: 'user.pending_approval',
      title: 'Đăng ký tài khoản mới',
      message: `${dto.email} vừa đăng ký với vai trò ${dto.role ?? 'PATIENT'}, đang chờ phê duyệt.`,
      severity: 'info',
      targetRoles: ['ADMIN'],
      meta: { email: dto.email, role: dto.role ?? 'PATIENT' },
    });

    return {
      message:
        'Đăng ký thành công. Tài khoản của bạn đang chờ phê duyệt từ quản trị viên. ' +
        'Bạn sẽ có thể đăng nhập sau khi được duyệt.',
    };
  }

  /**
   * Return the profile of the currently authenticated user.
   */
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Người dùng không tồn tại.');

    const { passwordHash: _omit, ...profile } = user;
    return profile;
  }
}
