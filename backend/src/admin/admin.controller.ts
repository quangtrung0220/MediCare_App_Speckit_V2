/*
 * Created: 2026-07-02
 * Purpose: Admin controller — user account management (ADMIN role only).
 * Owner: Quang Trung
 */
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  ConflictException,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { existsSync, copyFileSync, writeFileSync, unlinkSync } from 'fs';
import { User } from '../models/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * GET /api/v1/admin/users
   * List all users (password hash excluded).
   */
  @Get('users')
  async listUsers() {
    const users = await this.userRepo.find({
      order: { createdAt: 'DESC' },
    });
    return users.map(({ passwordHash: _omit, ...u }) => u);
  }

  /**
   * GET /api/v1/admin/users/pending
   * List accounts awaiting admin approval.
   */
  @Get('users/pending')
  async listPendingUsers() {
    const users = await this.userRepo.find({
      where: { isPendingApproval: true },
      order: { createdAt: 'ASC' },
    });
    return users.map(({ passwordHash: _omit, ...u }) => u);
  }

  /**
   * PATCH /api/v1/admin/users/:id/approve
   * Approve a pending account — clears isPendingApproval flag.
   */
  @Patch('users/:id/approve')
  async approveUser(@Param('id') id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Người dùng ${id} không tồn tại.`);
    if (!user.isPendingApproval) {
      throw new ConflictException('Tài khoản này đã được duyệt rồi.');
    }

    await this.userRepo.update(id, { isPendingApproval: false, isActive: true });
    return { message: `Tài khoản ${user.email} đã được phê duyệt thành công.` };
  }

  /**
   * DELETE /api/v1/admin/users/:id/reject
   * Reject and permanently delete a pending account.
   */
  @Delete('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Người dùng ${id} không tồn tại.`);

    await this.userRepo.delete(id);
    return { message: `Tài khoản ${user.email} đã bị từ chối và xóa khỏi hệ thống.` };
  }

  /**
   * PATCH /api/v1/admin/users/:id/block
   * Deactivate an active account — user cannot log in or make API calls.
   */
  @Patch('users/:id/block')
  async blockUser(@Param('id') id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Người dùng ${id} không tồn tại.`);
    if (!user.isActive) throw new ConflictException('Tài khoản này đã bị khóa rồi.');

    await this.userRepo.update(id, { isActive: false });
    return { message: `Tài khoản ${user.email} đã bị khóa.` };
  }

  /**
   * PATCH /api/v1/admin/users/:id/unblock
   * Re-activate a blocked account.
   */
  @Patch('users/:id/unblock')
  async unblockUser(@Param('id') id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Người dùng ${id} không tồn tại.`);
    if (user.isActive) throw new ConflictException('Tài khoản này đang hoạt động bình thường.');

    await this.userRepo.update(id, { isActive: true });
    return { message: `Tài khoản ${user.email} đã được mở khóa.` };
  }

  /**
   * GET /api/v1/admin/backup
   * Download a copy of the SQLite database file.
   */
  @Get('backup')
  async downloadBackup(@Res() res: Response) {
    const options = this.dataSource.options as any;
    if (options.type !== 'better-sqlite3') {
      throw new BadRequestException('Tính năng sao lưu chỉ khả dụng khi sử dụng cơ sở dữ liệu SQLite.');
    }

    const dbPath = options.database;
    if (dbPath === ':memory:') {
      throw new BadRequestException('Cơ sở dữ liệu đang chạy trên bộ nhớ (In-memory), không thể xuất tệp sao lưu.');
    }

    if (!existsSync(dbPath)) {
      throw new NotFoundException('Không tìm thấy tệp cơ sở dữ liệu SQLite.');
    }

    const filename = `medicare_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`;
    res.setHeader('Content-Type', 'application/x-sqlite3');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(dbPath);
  }

  /**
   * POST /api/v1/admin/restore
   * Upload an SQLite file to restore the database.
   */
  @Post('restore')
  @UseInterceptors(FileInterceptor('file'))
  async restoreBackup(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Vui lòng cung cấp tệp sao lưu (.sqlite) để khôi phục.');
    }

    const options = this.dataSource.options as any;
    if (options.type !== 'better-sqlite3') {
      throw new BadRequestException('Tính năng khôi phục chỉ khả dụng khi sử dụng cơ sở dữ liệu SQLite.');
    }

    const dbPath = options.database;
    if (dbPath === ':memory:') {
      throw new BadRequestException('Cơ sở dữ liệu đang chạy trên bộ nhớ (In-memory), không thể khôi phục tệp sao lưu.');
    }

    // Close active connection
    await this.dataSource.destroy();

    const bakPath = `${dbPath}.bak`;
    let isRestored = false;

    try {
      // Backup current DB to .bak copy
      if (existsSync(dbPath)) {
        copyFileSync(dbPath, bakPath);
      }

      // Write uploaded file buffer to dbPath
      writeFileSync(dbPath, file.buffer);
      isRestored = true;
    } catch (err) {
      // Restore from bak on failure
      if (existsSync(bakPath)) {
        copyFileSync(bakPath, dbPath);
      }
      throw new BadRequestException(`Khôi phục dữ liệu thất bại: ${err.message}`);
    } finally {
      // Re-open/initialize TypeORM connection
      await this.dataSource.initialize();
      // Remove temporary backup file
      if (isRestored && existsSync(bakPath)) {
        try {
          unlinkSync(bakPath);
        } catch {}
      }
    }

    return { message: 'Cơ sở dữ liệu đã được khôi phục thành công.' };
  }
}
