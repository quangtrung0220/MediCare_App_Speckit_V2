# HƯỚNG DẪN DEBUG & KHẮC PHỤC LỖI HỆ THỐNG MEDICARE (DEBUGGING GUIDE)

Tài liệu này hướng dẫn cách chẩn đoán, kiểm tra log, và khắc phục nhanh các lỗi thường gặp trên từng màn hình chức năng của ứng dụng MediCare (E2E).

---

## 1. Phương Pháp Debug Cơ Bản Toàn Hệ Thống

### A. Debug Frontend (Giao diện Next.js)
1. **Kiểm tra Console Trình duyệt (F12 DevTools)**:
   * Nhấn phím `F12` hoặc chuột phải chọn `Inspect` -> chọn Tab `Console` để xem các lỗi JavaScript, lỗi biên dịch, hoặc cảnh báo dữ liệu.
2. **Kiểm tra Network Request (Tab Network)**:
   * Xem các yêu cầu HTTP gửi từ Frontend lên Backend. Nếu cột `Status` báo màu đỏ (`500 Internal Error`, `404 Not Found`, hoặc `Blocked by CORS`), đó là lỗi kết nối API thực tế.
3. **Cơ chế Tự động Dự phòng (Mock Fallback)**:
   * Các dịch vụ Frontend được thiết kế để tự động chuyển sang chế độ giả lập nếu Backend bị sập (lỗi kết nối). Hãy kiểm tra log Console nếu thấy dòng cảnh báo:
     `Failed to fetch from real API, falling back to mock...`

### B. Debug Backend (Dịch vụ NestJS)
1. **Xem Log Terminal chạy Backend**:
   * Nhà phát triển chạy Backend bằng lệnh `npm run start:dev` (hoặc `npm run start`). Các lỗi truy vấn SQL, lỗi thực thi DB, hoặc thiếu dữ liệu đầu vào sẽ in trực tiếp ra màn hình terminal này.
2. **Kiểm tra Cơ sở dữ liệu SQLite (`medicare.sqlite`)**:
   * Cơ sở dữ liệu mặc định nằm tại thư mục gốc của backend: `backend/medicare.sqlite`.
   * **Lỗi khóa file (Database Locked)**: Nếu chạy seeder hoặc migration khi máy chủ NestJS đang chạy dở, có thể xảy ra lỗi khóa SQLite. Giải pháp: Tắt NestJS backend -> Chạy lệnh gieo mầm -> Khởi động lại NestJS.

---

## 2. Các Lỗi Thường Gặp Ở Từng Màn Hình & Cách Khắc Phục

### Màn hình 1: Tổng quan (Overview Dashboard)
* **Triệu chứng**: Các con số thống kê hiển thị bằng `0` hoặc không đổi; biểu đồ không hiển thị dữ liệu thực tế.
* **Cách Debug**:
  1. Kiểm tra API: Mở tab Network, tìm yêu cầu gửi tới `http://localhost:3001/api/v1/health` và `http://localhost:3001/api/v1/reports`.
  2. Nếu Backend trả về lỗi 500: Xem log NestJS xem có kết nối được file SQLite không.
  3. Lỗi căn lệch tâm biểu đồ tròn: Đã được xử lý bằng cách loại bỏ `transform-origin` trong CSS. Không tự ý thêm quy tắc transform-origin vào phần tử SVG.

### Màn hình 2: Bàn Lễ tân (Reception Desk) & Đặt lịch
* **Triệu chứng**: Bấm nút "Xác nhận Check-in" nhưng trạng thái bệnh nhân không đổi; hoặc đặt lịch hẹn mới báo lỗi.
* **Cách Debug**:
  1. Kiểm tra yêu cầu PATCH gửi tới `http://localhost:3001/api/v1/appointments/:id/check-in`.
  2. Kiểm tra xem `patientId` và `doctorId` gửi lên biểu mẫu có khớp chính xác với ID thực tế trong database không (nếu ID không tồn tại, database sẽ báo lỗi ràng buộc khóa ngoại - Foreign Key Constraint).

### Màn hình 3: Bàn Điều dưỡng (Nurse Desk)
* **Triệu chứng**: Nhập chỉ số sinh hiệu và lưu báo lỗi đỏ hoặc không lưu thành công.
* **Cách Debug**:
  1. Kiểm tra xem các trường số liệu (Huyết áp, Nhịp tim, Nhiệt độ) có bị nhập sai định dạng chữ không.
  2. Kiểm tra API `POST http://localhost:3001/api/v1/medical-records`. Nếu lỗi cơ sở dữ liệu, kiểm tra xem bảng `medical_records` có thiếu cột nào không thông qua lệnh kiểm tra schema của TypeORM.

### Màn hình 4: Bàn chẩn đoán của Bác sĩ (Doctor Desk)
* **Triệu chứng 1**: Ô tìm gợi ý thuốc không hiển thị danh mục thuốc khi nhập tên.
  * **Cách Debug**: Kiểm tra xem kho dược có dữ liệu không. Xem API `/api/v1/inventory` có trả về danh sách trống không.
* **Triệu chứng 2**: Lưu ca khám thành công nhưng không tạo được hóa đơn thanh toán hoặc đơn thuốc.
  * **Cách Debug**: Luồng này thực hiện liên tục 2 API: Đầu tiên là tạo bệnh án EMR (`POST /medical-records`), sau đó lấy ID EMR vừa sinh ra để tạo đơn thuốc (`POST /prescriptions`).
  * Nếu bước 1 thành công nhưng bước 2 thất bại, kiểm tra log TypeORM xem bảng `prescription_items` có lỗi ràng buộc dữ liệu hoặc lỗi kiểu dữ liệu hay không.

### Màn hình 5: Quầy phát thuốc của Dược sĩ (Pharmacy Desk)
* **Triệu chứng**: Bấm nút "Cấp phát" nhưng số lượng thuốc tồn kho không thay đổi.
* **Cách Debug**:
  1. Kiểm tra mã nguồn phương thức `dispensePrescription` trong `clinical.service.ts` tại backend.
  2. Kiểm tra xem ID thuốc trong đơn thuốc (`inventoryItemId`) có liên kết khớp chính xác với bản ghi thuốc trong bảng `inventory_items` không. Nếu liên kết bị `NULL`, hệ thống không thể trừ kho dược.

### Màn hình 6: Quầy Thanh toán (Billing & Invoices)
* **Triệu chứng**: Hóa đơn đã bấm "Thanh toán" nhưng vẫn nằm trong danh sách Chờ (Pending).
* **Cách Debug**:
  1. Kiểm tra API `PATCH http://localhost:3001/api/v1/payments/:id/pay`.
  2. Xem cơ sở dữ liệu bảng `payments`, cột `status` đã cập nhật sang `'COMPLETED'` và cột `completedAt` đã ghi nhận mốc thời gian hay chưa.

---

## 3. Các Lệnh Tiện Ích Phục Vụ Debug Nhanh

* **Chạy kiểm thử frontend**:
  `npm run test` (Chạy các bộ unit test Jest để phát hiện sớm lỗi giao diện bị vỡ hoặc đổi tên nút bấm).
* **Reset và cài đặt lại toàn bộ cơ sở dữ liệu sạch (Cực kỳ hữu ích khi lỗi dữ liệu rác)**:
  1. Dừng NestJS backend (Nhấn `Ctrl + C`).
  2. Chạy lệnh:
     `Remove-Item medicare.sqlite -ErrorAction SilentlyContinue; npx ts-node src/database/seeders/seed.ts`
  3. Khởi động lại NestJS backend:
     `npm run start` (hoặc `npm run start:dev`).
