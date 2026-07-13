/*
 * Created: 2026-07-02
 * Purpose: DTO for registration request body validation.
 * Owner: Quang Trung
 */
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import type { UserRole } from '../../models/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  /** Role requested — Admin reviews and approves before it takes effect */
  @IsOptional()
  @IsIn(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'PATIENT'], {
    message: 'Vai trò không hợp lệ',
  })
  role?: UserRole;
}
