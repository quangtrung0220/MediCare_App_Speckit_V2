# Plan: Tích hợp Xác thực Cấu hình Môi trường (Config Validation) khi Khởi động

Để ngăn ngừa máy chủ chạy ở trạng thái lỗi hoặc bị crash giữa chừng do thiếu các biến môi trường cấu hình hoặc cấu hình sai kiểu dữ liệu (như cổng PORT không phải số, định dạng DB_TYPE sai...), kế hoạch này đề xuất thiết lập cơ chế kiểm tra và xác thực cấu hình môi trường (.env) ngay khi khởi động (Boot-time Config Validation).

## User Review Required

> [!IMPORTANT]
> - **Chặn khởi động khi thiếu/sai cấu hình**: Nếu thiếu bất kỳ biến cấu hình bắt buộc nào (như `DB_TYPE`, `DB_DATABASE`, `PORT`, `CORS_ORIGIN`) hoặc sai kiểu dữ liệu, NestJS sẽ ném ra ngoại lệ và dừng quá trình khởi động máy chủ ngay lập tức. Điều này giúp phát hiện lỗi cấu hình sớm nhất có thể.
> - **Tái sử dụng class-validator**: Tận dụng thư viện `class-validator` đã có sẵn trong dự án để định nghĩa schema xác thực cho các biến môi trường mà không cần cài đặt thêm thư viện bên ngoài (như Joi).

---

## Proposed Changes

### [Component] Backend Configuration Validation

#### [NEW] [env.validation.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/config/env.validation.ts)
- Định nghĩa lớp `EnvironmentVariables` chứa các ràng buộc xác thực:
  * `NODE_ENV`: Bắt buộc, thuộc một trong ba giá trị `'development' | 'production' | 'test'`.
  * `PORT`: Bắt buộc, kiểu số (`@IsNumber()`).
  * `CORS_ORIGIN`: Bắt buộc, kiểu chuỗi (`@IsString()`).
  * `DB_TYPE`: Bắt buộc, thuộc `'sqlite' | 'postgres'`.
  * `DB_DATABASE`: Bắt buộc, kiểu chuỗi.
  * `THROTTLE_TTL`: Kiểu số, mặc định 60000.
  * `THROTTLE_LIMIT`: Kiểu số, mặc định 100.
- Tạo hàm `validate(config)` sử dụng `plainToInstance` và `validateSync` để ép kiểu dữ liệu và kiểm tra cấu hình.

#### [MODIFY] [database.module.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/database/database.module.ts)
- Import hàm `validate` từ `../config/env.validation`.
- Đăng ký hàm xác thực vào `ConfigModule.forRoot`:
  ```typescript
  ConfigModule.forRoot({
    isGlobal: true,
    validate,
  })
  ```

---

## Verification Plan

### Automated Tests
- Đảm bảo các bài kiểm thử biên dịch và chạy thành công mà không gặp lỗi cấu hình:
  `npm run test`
  `npm run test:e2e`

### Manual Verification
1. Mở file `.env` của backend, sửa biến `PORT` thành một chuỗi chữ cái (ví dụ: `PORT=not_a_number`).
2. Khởi động backend (`npm run start`). Xác nhận hệ thống ném ra lỗi xác thực chi tiết và từ chối khởi động.
3. Trả lại giá trị đúng cho `PORT` trong `.env` và xác nhận hệ thống khởi động bình thường.
