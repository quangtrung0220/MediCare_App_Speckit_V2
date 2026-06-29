# Plan: Tích hợp Rate Limiting & Helmet Security Headers cho REST API

Để bảo vệ hệ thống khỏi các cuộc tấn công Brute-force, từ chối dịch vụ (DoS) và tăng cường độ bảo mật cho các tiêu đề HTTP (HTTP Headers), kế hoạch này đề xuất tích hợp thư viện `helmet` và hệ thống giới hạn lượt gọi `@nestjs/throttler`.

## User Review Required

> [!IMPORTANT]
> - **Cấu hình Helmet**: Đăng ký Middleware Helmet toàn cục trong `main.ts`. Helmet tự động thiết lập các tiêu đề HTTP quan trọng (như Content-Security-Policy, X-Frame-Options, Strict-Transport-Security...) để phòng tránh tấn công XSS, Clickjacking và MIME-sniffing.
> - **Giới hạn API Rate Limiting**: Thiết lập giới hạn tối đa **100 lượt gọi (requests) trong vòng 1 phút (60 giây)** trên mỗi địa chỉ IP. Mọi yêu cầu vượt quá giới hạn này sẽ nhận về mã phản hồi `429 Too Many Requests`.
> - **Ngoại lệ/Tùy biến**: Đối với các cổng thông tin lâm sàng nội bộ cần tải dữ liệu liên tục, chúng ta có thể tùy chỉnh bỏ qua (skip) hoặc tăng giới hạn cho các IP nội bộ hoặc thông qua các Decorator ghi đè (ví dụ: `@SkipThrottle()`).

---

## Proposed Changes

### [Component] Backend Core Security Setup

#### [MODIFY] [package.json](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/package.json)
- Thêm các thư viện phụ thuộc:
  * `@nestjs/throttler`
  * `helmet`

#### [MODIFY] [app.module.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/app.module.ts)
- Import và đăng ký `ThrottlerModule`:
  ```typescript
  ThrottlerModule.forRoot([{
    ttl: 60000, // 1 phút
    limit: 100, // Tối đa 100 yêu cầu / phút
  }])
  ```
- Đăng ký `ThrottlerGuard` làm Guard bảo vệ toàn cục trong danh sách `providers`:
  ```typescript
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }
  ```

#### [MODIFY] [main.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/main.ts)
- Import `helmet` và cấu hình Middleware:
  ```typescript
  import helmet from 'helmet';
  // ...
  app.use(helmet());
  ```

---

## Verification Plan

### Automated Tests
- Đảm bảo cài đặt thư viện thành công và tất cả các test suite của backend hoạt động ổn định:
  `npm run test`
  `npm run test:e2e`

### Manual Verification
1. Dùng công cụ gọi API (như Postman/cURL) để gửi liên tục hơn 100 requests trong vòng 1 phút tới điểm cuối `/api/v1/health`.
2. Xác nhận hệ thống trả về mã trạng thái `429 Too Many Requests` sau request thứ 100.
3. Kiểm tra các tiêu đề HTTP trong phản hồi (Response Headers): Xác nhận có sự xuất hiện của các thẻ bảo mật Helmet như `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`.
