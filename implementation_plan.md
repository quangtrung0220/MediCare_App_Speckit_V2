# Plan: Tích hợp Hệ thống Ghi nhật ký Cấu trúc (Structured JSON Logging) bằng Winston

Trong môi trường sản phẩm (production), việc ghi nhật ký bằng `console.log` thô rất khó truy vấn và tổng hợp. Kế hoạch này đề xuất tích hợp bộ ghi nhật ký có cấu trúc `winston` và `nest-winston` để chuẩn hóa các bản ghi dạng JSON có cấu trúc trong production (dễ dàng đẩy lên ELK, Datadog...) và định dạng màu trực quan (Colorized, Human-readable) trong môi trường local.

## User Review Required

> [!IMPORTANT]
> - **Chuyển đổi Logger toàn cục**: Thay thế Logger mặc định của NestJS bằng Winston Logger ở cấp độ toàn hệ thống. Mọi log khởi động, log truy cập và log lỗi hệ thống sẽ đi qua bộ lọc định dạng này.
> - **Định dạng theo Môi trường**:
>   * `production`: Ghi log dạng cấu trúc JSON một dòng (Single-line JSON) chứa đầy đủ thông tin: `timestamp`, `level`, `context`, `message`, `stack` (nếu có lỗi).
>   * `development`: Ghi log định dạng màu sắc trực quan, thụt lề rõ ràng để lập trình viên dễ đọc trong quá trình debug.

---

## Proposed Changes

### [Component] Backend Structured Logger

#### [MODIFY] [package.json](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/package.json)
- Thêm các thư viện phụ thuộc:
  * `winston`
  * `nest-winston`

#### [NEW] [logger.config.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/config/logger.config.ts)
- Viết cấu hình Winston định dạng log động theo `NODE_ENV`:
  * Môi trường phát triển: Dùng `winston.format.combine(winston.format.colorize(), winston.format.simple())`.
  * Môi trường production: Dùng `winston.format.combine(winston.format.timestamp(), winston.format.json())`.

#### [MODIFY] [main.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/main.ts)
- Thay thế Logger mặc định bằng Winston Logger khi tạo ứng dụng:
  ```typescript
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });
  ```

---

## Verification Plan

### Automated Tests
- Kiểm tra tính tương thích và đảm bảo các unit/E2E test pass bình thường:
  `npm run test`
  `npm run test:e2e`

### Manual Verification
1. Chạy backend với `NODE_ENV=development` và quan sát định dạng log trong terminal (phải có màu sắc, định dạng dễ đọc).
2. Chạy thử backend giả lập production: Thêm `NODE_ENV=production` vào `.env` và khởi động lại.
3. Xác nhận tất cả log hệ thống hiển thị dưới dạng JSON một dòng, ví dụ:
   `{"level":"info","message":"Nest application successfully started","timestamp":"2026-06-29T16:04:00.000Z","context":"NestApplication"}`
