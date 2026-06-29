# Plan: Tích hợp Soft Delete (Xóa mềm) cho Hồ sơ Bệnh nhân và Lịch hẹn

Để bảo vệ lịch sử dữ liệu y tế và hành chính lâm sàng tránh khỏi việc bị xóa vĩnh viễn ngoài ý muốn, kế hoạch này triển khai tính năng Xóa mềm (Soft Delete) đối với thực thể Bệnh nhân (Patient) và Lịch hẹn (Appointment).

## User Review Required

> [!IMPORTANT]
> - **Cột thời gian xóa `@DeleteDateColumn`**: Thêm cột `deletedAt` tự động vào cơ sở dữ liệu SQLite. Khi gọi lệnh xóa, TypeORM sẽ cập nhật mốc thời gian xóa thay vì chạy câu lệnh `DELETE` cứng.
> - **Tự động lọc bản ghi bị xóa**: Mọi truy vấn mặc định (`find`, `findOne`, `count`, `search`) của TypeORM trên Patient và Appointment sẽ tự động loại trừ các bản ghi có `deletedAt` khác null. Điều này giúp hệ thống hoạt động bình thường mà không cần sửa đổi các logic truy vấn hiện tại.
> - **Điểm cuối khôi phục (Restore Endpoints)**: Cung cấp 2 API dạng PATCH:
>   - `PATCH /api/v1/patients/:id/restore`
>   - `PATCH /api/v1/appointments/:id/restore`
>   để cho phép quản trị viên hoặc nhân viên khôi phục hồ sơ khi cần thiết.

---

## Proposed Changes

### [Component] Entities & Repositories

#### [MODIFY] [patient.entity.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/models/patient.entity.ts)
- Import `DeleteDateColumn` từ `'typeorm'`.
- Thêm thuộc tính:
  ```typescript
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
  ```

#### [MODIFY] [appointment.entity.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/models/appointment.entity.ts)
- Import `DeleteDateColumn` từ `'typeorm'`.
- Thêm thuộc tính:
  ```typescript
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
  ```

#### [MODIFY] [base-repository.interface.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/contracts/base-repository.interface.ts)
- Thêm chữ ký hàm khôi phục tùy chọn:
  ```typescript
  restore?(id: string): Promise<boolean>;
  ```

#### [MODIFY] [patient.repository.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/repositories/patient.repository.ts)
- Thay đổi `delete(id)` từ `this.repo.delete(id)` thành `this.repo.softDelete(id)`.
- Thêm phương thức `restore(id)` gọi `this.repo.restore(id)`.

#### [MODIFY] [appointment.repository.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/repositories/appointment.repository.ts)
- Thay đổi `delete(id)` từ `this.repo.delete(id)` thành `this.repo.softDelete(id)`.
- Thêm phương thức `restore(id)` gọi `this.repo.restore(id)`.

---

### [Component] Services & Controllers

#### [MODIFY] [patient.service.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/patient.service.ts)
- Thêm phương thức `restore(id)` gọi `this.patientRepo.restore(id)`. Ném ra `NotFoundException` nếu khôi phục thất bại.

#### [MODIFY] [patient.controller.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/controllers/patient.controller.ts)
- Thêm REST API khôi phục bệnh nhân:
  ```typescript
  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<void> {
    return this.patientService.restore(id);
  }
  ```

#### [MODIFY] [appointment.service.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/appointment.service.ts)
- Thêm phương thức `restore(id)` gọi `this.appointmentRepo.restore(id)`. Ném ra `NotFoundException` nếu khôi phục thất bại.

#### [MODIFY] [appointment.controller.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/controllers/appointment.controller.ts)
- Thêm REST API khôi phục lịch hẹn:
  ```typescript
  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<void> {
    return this.appointmentService.restore(id);
  }
  ```

---

## Verification Plan

### Automated Tests
- Chạy toàn bộ test suite của backend để đảm bảo không có lỗi biên dịch:
  `npm run test`
  `npm run test:e2e`

### Manual Verification
1. Gọi API `DELETE /api/v1/patients/:id` của một bệnh nhân có sẵn.
2. Kiểm tra trong cơ sở dữ liệu SQLite: Xác nhận bản ghi đó vẫn tồn tại trong bảng `patients` nhưng cột `deletedAt` được cập nhật giá trị thời gian xóa.
3. Gọi API `GET /api/v1/patients/:id`: Xác nhận trả về lỗi `404 Not Found` (do mặc định đã lọc bản ghi bị xóa).
4. Gọi API `PATCH /api/v1/patients/:id/restore` để khôi phục.
5. Gọi lại API `GET /api/v1/patients/:id`: Xác nhận trả về thông tin bệnh nhân đầy đủ như trước.
