# Plan: Tích hợp Mã hóa Dữ liệu Nhạy cảm (Encryption at Rest) bằng AES-256

Trong phần mềm y tế, việc bảo mật hồ sơ bệnh án (sự kiện, chẩn đoán, điều trị...) và thông tin cá nhân của bệnh nhân (số điện thoại, địa chỉ) là bắt buộc (theo tiêu chuẩn bảo mật y tế như HIPAA/GDPR). Kế hoạch này đề xuất tích hợp cơ chế mã hóa trong suốt (Transparent Encryption/Decryption) tại tầng TypeORM bằng thuật toán **AES-256-CBC** sử dụng thư viện `crypto` tích hợp sẵn của Node.js.

## User Review Required

> [!IMPORTANT]
> - **Mã hóa trong suốt (Transparent Encryption)**: Quá trình mã hóa khi lưu và giải mã khi đọc diễn ra hoàn toàn tự động ở tầng Database ORM. Các dịch vụ (`ClinicalService`, `PatientService`) và cổng giao diện (Frontend) không cần thay đổi code xử lý chuỗi.
> - **Các trường dữ liệu sẽ mã hóa**:
>   * Bệnh án (`MedicalRecord`): `symptoms` (triệu chứng), `diagnosis` (chẩn đoán), `treatment` (hướng điều trị).
>   * Bệnh nhân (`Patient`): `phone` (số điện thoại), `address` (địa chỉ).
> - **Biến môi trường khóa mã hóa (`ENCRYPTION_KEY`)**: Cần đăng ký một khóa bí mật trong tệp `.env`. Nếu thay đổi khóa này, dữ liệu cũ đã mã hóa sẽ không thể giải mã được (hệ thống sẽ tự động fallback trả về dữ liệu mã hóa gốc để tránh crash).

---

## Proposed Changes

### [Component] Database Encryption Layer

#### [NEW] [encryption.transformer.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/database/transformers/encryption.transformer.ts)
- Định nghĩa class `EncryptionTransformer` kế thừa `ValueTransformer` của TypeORM:
  * Phương thức `to()`: Mã hóa dữ liệu trước khi lưu vào DB bằng thuật toán AES-256-CBC, sử dụng một chuỗi Vector khởi tạo ngẫu nhiên (IV - Initialization Vector) mỗi lần mã hóa và nối ghép theo định dạng `iv:encryptedText`.
  * Phương thức `from()`: Tách chuỗi dạng `iv:encryptedText`, giải mã ngược lại thành văn bản gốc.
  * Tự động fallback trả về dữ liệu thô nếu phát hiện dữ liệu chưa được mã hóa trước đó hoặc giải mã thất bại do khóa sai.

#### [MODIFY] [patient.entity.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/models/patient.entity.ts)
- Cấu hình transformer cho cột `phone` và `address`:
  ```typescript
  @Column({ nullable: true, transformer: new EncryptionTransformer() })
  phone: string;

  @Column({ nullable: true, transformer: new EncryptionTransformer() })
  address: string;
  ```

#### [MODIFY] [medical-record.entity.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/models/medical-record.entity.ts)
- Cấu hình transformer cho cột `symptoms`, `diagnosis`, `treatment`:
  ```typescript
  @Column({ type: 'text', nullable: true, transformer: new EncryptionTransformer() })
  symptoms: string;

  @Column({ type: 'text', nullable: true, transformer: new EncryptionTransformer() })
  diagnosis: string;

  @Column({ type: 'text', nullable: true, transformer: new EncryptionTransformer() })
  treatment: string;
  ```

---

## Verification Plan

### Automated Tests
- Kiểm tra tính tương thích dữ liệu và đảm bảo tất cả kiểm thử E2E / Unit tests chạy bình thường:
  `npm run test`
  `npm run test:e2e`

### Manual Verification
1. Đăng ký khóa `ENCRYPTION_KEY=my_super_secret_key_123456789012` trong `.env`.
2. Tạo mới một bệnh nhân và tạo một bệnh án thông qua giao diện Next.js hoặc E2E test.
3. Dùng một trình quản lý cơ sở dữ liệu SQLite hoặc câu lệnh truy vấn SQLite thô để kiểm tra trực tiếp tệp `medicare.sqlite`:
   * Xác nhận dữ liệu trong bảng `patients` cột `phone`, `address` và bảng `medical_records` cột `diagnosis`, `symptoms` đã bị mã hóa thành dạng hex (ví dụ: `4f7d...:e2ba...`).
4. Kiểm tra lại trên giao diện web: Xác nhận thông tin hiển thị lên UI vẫn đầy đủ nội dung giải mã (đọc bình thường).
