# HƯỚNG DẪN DEBUG & KHẮC PHỤC LỖI HỆ THỐNG MEDICARE (DEBUGGING GUIDE)

Tài liệu này cung cấp các hướng dẫn chẩn đoán lỗi chi tiết và các ví dụ thực tế cụ thể để sửa lỗi trên từng phân hệ màn hình của MediCare.

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

## 2. 5 Tình Huống Lỗi Thực Tế & Hướng Dẫn Sửa Lỗi Chi Tiết

### 🛠️ Tình huống 1: Lỗi CORS khi Gọi API Backend
* **Triệu chứng**: Giao diện Overview Dashboard không tải được biểu đồ và các số liệu thống kê. Mở F12 DevTools Console thấy thông báo lỗi màu đỏ:
  ```text
  Access to fetch at 'http://localhost:3001/api/v1/health' from origin 'http://localhost:3000' 
  has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  ```
* **Nguyên nhân**: NestJS Backend (chạy ở cổng `3001`) từ chối nhận các yêu cầu HTTP gửi đến từ Next.js Frontend (chạy ở cổng `3000`) do chính sách bảo mật nguồn gốc.
* **Cách khắc phục**:
  1. Mở file cấu hình chính của NestJS: [main.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/main.ts).
  2. Đảm bảo rằng phương thức `enableCors` đã được kích hoạt trước khi ứng dụng khởi chạy:
     ```typescript
     // main.ts
     const app = await NestFactory.create(AppModule);
     app.setGlobalPrefix('api/v1');
     
     // Bật CORS cho phép Next.js truy cập
     app.enableCors({
       origin: 'http://localhost:3000',
       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
       credentials: true,
     });
     
     await app.listen(3001);
     ```
  3. Khởi động lại backend để áp dụng cấu hình mới.

---

### 🛠️ Tình huống 2: Lỗi Khóa Cơ Sở Dữ Liệu (`SQLITE_BUSY: database is locked`)
* **Triệu chứng**: Bác sĩ nhấn nút "Lưu ca khám" hoặc Lễ tân xác nhận "Check-in", giao diện báo lỗi đỏ và terminal NestJS backend in ra thông báo:
  ```text
  QueryFailedError: SQLITE_BUSY: database is locked
      at SquireDriver.ts:215
  ```
* **Nguyên nhân**: SQLite là cơ sở dữ liệu dạng tệp đơn giản. Nó chỉ cho phép một luồng tiến trình thực hiện ghi dữ liệu tại một thời điểm. Nếu bạn đang mở tệp `medicare.sqlite` bằng một công cụ xem DB ngoài (như DB Browser for SQLite) ở chế độ đang chỉnh sửa chưa commit, hoặc chạy lệnh Seed dữ liệu khi server NestJS đang thực hiện ghi, SQLite sẽ khóa tệp lại.
* **Cách khắc phục**:
  1. Đóng toàn bộ các chương trình xem cơ sở dữ liệu SQLite bên ngoài đang kết nối tới tệp `medicare.sqlite`.
  2. Nếu chạy các tác vụ chạy ngầm, hãy thiết lập tham số chờ kết nối (connection timeout) trong cấu hình kết nối TypeORM của bạn:
     ```typescript
     // data-source.ts hoặc app.module.ts
     TypeOrmModule.forRoot({
       type: 'sqlite',
       database: 'medicare.sqlite',
       entities: [...],
       synchronize: true,
       // Tăng thời gian chờ ghi nếu DB bận (đơn vị: mili-giây)
       extra: {
         busyTimeout: 5000, 
       }
     })
     ```
  3. Khởi động lại tiến trình server NestJS.

---

### 🛠️ Tình huống 3: Lỗi Ràng Buộc Khóa Ngoại khi Đặt Lịch Hẹn (`FOREIGN KEY constraint failed`)
* **Triệu chứng**: Lễ tân đặt lịch hẹn cho bệnh nhân có mã số `PAT-999` nhưng hệ thống báo lỗi thất bại. Terminal NestJS in log:
  ```text
  QueryFailedError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
  ```
* **Nguyên nhân**: Bảng `appointments` có cột `patientId` liên kết với khóa chính của bảng `patients`. Việc đặt lịch cho bệnh nhân có ID `PAT-999` khi bệnh nhân này chưa hề được đăng ký trong bảng `patients` sẽ phá vỡ tính toàn vẹn dữ liệu.
* **Cách khắc phục**:
  1. Hãy đảm bảo kiểm tra sự tồn tại của bệnh nhân trước khi đặt lịch hẹn.
  2. Kiểm tra trong phương thức tạo lịch hẹn ở [appointment.service.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/backend/src/services/appointment.service.ts):
     ```typescript
     async createAppointment(dto: CreateAppointmentDto) {
       // Bước 1: Xác thực xem bệnh nhân có tồn tại không
       const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
       if (!patient) {
         throw new NotFoundException(`Không tìm thấy bệnh nhân có mã số ${dto.patientId}`);
       }
       
       // Bước 2: Tạo lịch hẹn
       const appt = this.apptRepo.create(dto);
       return await this.apptRepo.save(appt);
     }
     ```
  3. Đăng ký thông tin bệnh nhân trước trong màn hình **Patients Directory** rồi mới tiến hành đặt lịch.

---

### 🛠️ Tình huống 4: Số Lượng Thuốc Tồn Kho Không Trừ khi Dược Sĩ Cấp Phát
* **Triệu chứng**: Dược sĩ ấn nút "Cấp phát" (Dispense) đơn thuốc gồm 5 viên `Paracetamol 500mg`. Đơn thuốc đổi sang trạng thái `DISPENSED`, nhưng khi kiểm tra trang **Medicine Inventory**, tồn kho của Paracetamol vẫn giữ nguyên không giảm.
* **Nguyên nhân**: Logic xử lý của Dược sĩ chỉ cập nhật trạng thái đơn thuốc mà quên không thực hiện truy vấn giảm số lượng tồn kho (`quantity`) của thuốc trong bảng `inventory_items`.
* **Cách khắc phục**:
  1. Mở file xử lý cấp phát đơn thuốc tại backend: `backend/src/services/clinical.service.ts`.
  2. Đảm bảo vòng lặp duyệt qua các loại thuốc trong đơn thuốc và trừ số lượng tương ứng trong kho dược:
     ```typescript
     // clinical.service.ts
     async dispensePrescription(prescriptionId: string) {
       const prescription = await this.prescriptionRepo.findOne({
         where: { id: prescriptionId },
         relations: ['items']
       });
       
       if (!prescription) throw new NotFoundException('Không tìm thấy đơn thuốc');
       
       // Duyệt từng thuốc trong đơn để trừ kho
       for (const item of prescription.items) {
         const invItem = await this.inventoryRepo.findOne({ where: { name: item.name } });
         if (invItem) {
           // Giảm trừ kho
           invItem.quantity = Math.max(0, invItem.quantity - item.quantity);
           await this.inventoryRepo.save(invItem);
           
           console.log(`Đã trừ kho thuốc ${item.name}: -${item.quantity} viên. Còn lại: ${invItem.quantity}`);
         }
       }
       
       prescription.status = 'DISPENSED';
       return await this.prescriptionRepo.save(prescription);
     }
     ```

---

### 🛠️ Tình huống 5: Lỗi Định Dạng Ngày Khám (`Invalid Date` hoặc `NaN-NaN-NaN`)
* **Triệu chứng**: Trên màn hình bệnh án bệnh nhân, phần lịch sử hiển thị ngày khám là `NaN-NaN-NaN` hoặc không hiển thị thông tin ngày.
* **Nguyên nhân**: Frontend gửi chuỗi ngày khám lên Backend bằng đối tượng `new Date()` chứa múi giờ đầy đủ (ví dụ: `2026-06-28T06:30:00.000Z`), nhưng Backend hoặc DB SQLite chỉ lưu trữ chuỗi văn bản ngày dạng ngắn `YYYY-MM-DD`. Khi Frontend nhận lại chuỗi ngày không chuẩn và thực hiện tách chuỗi hoặc chuyển đổi định dạng sẽ sinh lỗi `Invalid Date`.
* **Cách khắc phục**:
  1. Đồng bộ hóa định dạng ngày khám thành chuỗi `YYYY-MM-DD` chuẩn ISO ngắn gọn trước khi truyền tải qua API.
  2. Ở Frontend, chuẩn hóa ngày gửi đi:
     ```typescript
     // Khi lưu ca khám bệnh
     const visitDate = new Date().toISOString().split('T')[0]; // Trả về dạng: "2026-06-28"
     ```
  3. Ở tệp hiển thị, dùng hàm chuyển đổi an toàn để phòng tránh hiển thị lỗi:
     ```typescript
     export function formatDate(dateString: string): string {
       if (!dateString) return 'Chưa xác định';
       const date = new Date(dateString);
       if (isNaN(date.getTime())) {
         // Nếu chuỗi ngày bị lỗi, thử cắt chuỗi ký tự cơ bản
         return dateString.substring(0, 10);
       }
       // Trả về định dạng Việt Nam ngày/tháng/năm
       return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
     }
     ```

---

### 🛠️ Tình huống 6: Lỗi Xác Thực JWT & Phân quyền RBAC (`401 Unauthorized` hoặc `403 Forbidden`)
* **Triệu chứng**: Giao diện báo lỗi mất quyền truy cập, các cuộc gọi API trả về mã lỗi `401 Unauthorized` hoặc `403 Forbidden`. Hoặc đăng ký tài khoản nhân viên mới xong nhưng không thể đăng nhập.
* **Nguyên nhân**: 
  1. Thiếu tiêu đề xác thực `Authorization: Bearer <token>` trong các yêu cầu API được bảo vệ bởi `JwtAuthGuard` toàn cục.
  2. Vai trò của tài khoản không đủ quyền truy cập (ví dụ: Dược sĩ cố tình truy cập vào API Admin `/admin/*`).
  3. Tài khoản mới đăng ký đang ở trạng thái chờ quản trị viên phê duyệt (`isPendingApproval` là `true` trong DB).
* **Cách khắc phục**:
  1. **Kiểm tra JWT gửi đi**: Đảm bảo các hàm gọi API ở Frontend sử dụng `authHeaders()` từ [auth.service.ts](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/frontend/src/services/auth.service.ts) để tự động điền Bearer token vào Headers.
  2. **Bỏ qua xác thực cho các route công khai**: Đối với các route như trang đăng nhập, đăng ký, hoặc kiểm tra health check, đảm bảo đã đánh dấu decorator `@Public()` ở controller phía Backend.
  3. **Phê duyệt tài khoản**: Sử dụng tài khoản `admin@medicare.vn` (mật khẩu mặc định `Medicare@2026`) truy cập vào trang Admin Panel để phê duyệt tài khoản mới (`isPendingApproval: false`).

---

### 🛠️ Tình huống 7: Lỗi Mất Kết Nối Chuông Thông Báo Real-time (SSE Connection Failed)
* **Triệu chứng**: Chấm tròn trạng thái trên chuông thông báo 🔔 có màu xám hoặc đỏ (Offline). Không nhận được thông báo mới khi có ca check-in hoặc khi kê đơn thuốc. Console báo lỗi:
  ```text
  EventSource's response has a MIME type ("application/json") that is not "text/event-stream". Connection aborted.
  ```
* **Nguyên nhân**: 
  1. Trình duyệt tự ngắt kết nối do Bearer token truyền vào query param `?token=` bị sai, hết hạn, hoặc trống khiến backend trả về lỗi JSON `401 Unauthorized` thay vì luồng stream.
  2. Kết nối mạng chập chờn hoặc backend NestJS bị lỗi deadlock tiến trình.
* **Cách khắc phục**:
  1. **Xác thực JWT trong SSE**: Trình duyệt `EventSource` không hỗ trợ gửi tiêu đề HTTP Header tùy chỉnh, do đó bắt buộc phải truyền token qua Query Parameter:
     `new EventSource('/api/v1/notifications/stream?token=' + token)`
     Đảm bảo token được lấy chính xác từ `localStorage` trước khi khởi tạo kết nối.
  2. **Kiểm tra đầu dây nhận phía Backend**: Đảm bảo route `/notifications/stream` đã được mở công khai bằng `@Public()` để tránh bị `JwtAuthGuard` toàn cục chặn trước khi đọc query token:
     ```typescript
     // notification.controller.ts
     @Public()
     @Sse('stream')
     stream(@Query('token') token: string, ...) {
        // Tự giải mã và kiểm tra jwt ở đây
     }
     ```
  3. **Kiểm tra số lượng kết nối đang hoạt động**: Gửi yêu cầu HTTP GET đến cổng `/api/v1/notifications/health` để xem số lượng kết nối SSE đang mở trong bộ nhớ máy chủ nhằm phát hiện rò rỉ kết nối (connection leak).

---

## 4. Các Lệnh Tiện Ích Phục Vụ Debug Nhanh

* **Chạy kiểm thử frontend**:
  `npm run test` (Chạy các bộ unit test Jest để phát hiện sớm lỗi giao diện bị vỡ hoặc đổi tên nút bấm).
* **Reset và cài đặt lại toàn bộ cơ sở dữ liệu sạch (Cực kỳ hữu ích khi lỗi dữ liệu rác)**:
  1. Dừng NestJS backend (Nhấn `Ctrl + C`).
  2. Chạy lệnh:
     `Remove-Item medicare.sqlite -ErrorAction SilentlyContinue; npx ts-node src/database/seeders/seed.ts`
  3. Khởi động lại NestJS backend:
     `npm run start` (hoặc `npm run start:dev`).

