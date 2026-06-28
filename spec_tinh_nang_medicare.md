# TÀI LIỆU TẢ THÔNG SỐ TÍNH NĂNG ỨNG DỤNG MEDICARE (SPEC DOC)

Tài liệu này mô tả chi tiết tính năng, luồng hoạt động (workflow) và giao diện thiết kế của tất cả các phân hệ màn hình trong hệ thống Quản lý phòng khám MediCare.

---

## 1. Kiến Trúc Chung & Phong Cách Thiết Kế

* **Backend**: NestJS REST API, lưu trữ trên cơ sở dữ liệu SQLite (`medicare.sqlite`). Toàn bộ API được phục vụ dưới tiền tố phân bản `/api/v1/*`.
* **Frontend**: Next.js 16 (App Router) sử dụng Turbopack biên dịch nhanh.
* **Hệ thống phông chữ (Typography)**: Đồng bộ phông chữ Google Font **`Plus Jakarta Sans`** toàn hệ thống. Kế thừa phông chữ tự động cho mọi thành phần điều khiển biểu mẫu (`input`, `select`, `button`).
* **Giao diện bảng (Tables)**: Định dạng kính mờ (glassmorphism), có bóng đổ mịn, hiệu ứng hover đổi màu hàng và tự động co giãn hoặc chuyển đổi bố cục thẻ (cards) linh hoạt trên các thiết bị di động.

---

## 2. Các Phân Hệ Màn Hình Chi Tiết

### Phân hệ 1: Màn hình Tổng quan (Overview Dashboard)
* **Mục đích**: Bàn làm việc trung tâm cung cấp số liệu phân tích hoạt động phòng khám trong ngày và tuần.
* **Các tính năng chính**:
  1. **Thẻ thống kê nhanh (Metric Cards)**: Hiển thị 4 chỉ số quan trọng hôm nay gồm: Lượt hẹn, Bác sĩ trực, Số ca đợi đo sinh hiệu, Đơn thuốc chờ cấp phát.
  2. **Biểu đồ phân tích hiệu suất tuần (SVG Charts)**:
     * *Biểu đồ Lượt khám*: Dạng đồ thị đường (Line Chart) biểu diễn lượng bệnh nhân trong 7 ngày, hỗ trợ rê chuột (hover) hiển thị số ca cụ thể (Tooltip).
     * *Biểu đồ Doanh thu*: Dạng đồ thị cột (Bar Chart) biểu diễn số tiền phòng khám thu được hàng ngày (đơn vị triệu đồng).
  3. **Hàng đợi bệnh nhân hôm nay**: Danh sách bệnh nhân đã check-in và trạng thái hiện tại (Đợi đo sinh hiệu, Chờ khám).
  4. **Hoạt động mới nhất (Activity Logs)**: Nhật ký ghi nhận các hành động bảo mật của hệ thống theo dạng dòng thời gian (timeline).

---

### Phân hệ 2: Bàn đón tiếp Lễ tân (Reception Desk)
* **Mục đích**: Quản lý lịch hẹn bệnh nhân đăng ký trước và tiếp đón bệnh nhân đến khám trực tiếp.
* **Các tính năng chính**:
  1. **Hàng đợi Check-in hôm nay**: Hiển thị danh sách các bệnh nhân có lịch hẹn trong ngày.
  2. **Nút "Xác nhận Check-in"**: Khi bệnh nhân đến phòng khám, lễ tân bấm nút này để đổi trạng thái lịch hẹn thành `CHECKED_IN`, lập tức đẩy bệnh nhân vào hàng đợi của Điều dưỡng và Bác sĩ.

---

### Phân hệ 3: Bàn đo sinh hiệu Điều dưỡng (Nurse Desk)
* **Mục đích**: Tiếp nhận bệnh nhân đã check-in, đo các chỉ số sinh học cơ bản trước khi chuyển ca sang phòng khám của Bác sĩ.
* **Các tính năng chính**:
  1. **Danh sách chờ sinh hiệu**: Hiển thị các ca khám có trạng thái `CHECKED_IN` trong ngày.
  2. **Biểu mẫu ghi chép sinh hiệu (Vitals Form)**:
     * Nhập chỉ số: Huyết áp (BP - mmHg), Nhịp tim (HR - bpm), Nhiệt độ cơ thể (Temp - °C), Chiều cao (cm), Cân nặng (kg).
     * Bấm "Lưu sinh hiệu" để đẩy dữ liệu EMR đồng bộ lên hệ thống dữ liệu.

---

### Phân hệ 4: Bàn chẩn đoán của Bác sĩ (Doctor Desk)
* **Mục đích**: Trọng tâm khám chữa bệnh, cho phép bác sĩ tra cứu bệnh án cũ, ghi nhận triệu chứng, chẩn đoán bệnh và kê đơn thuốc số.
* **Các tính năng chính**:
  1. **Phòng khám lâm sàng (Clinical Encounter)**: Thiết kế dạng bảng chia đôi màn hình (Split-panel):
     * *Cột bên trái*: Hiển thị thông tin dị ứng của bệnh nhân và **Lịch sử các lần khám cũ (EMR History)** được sắp xếp theo thời gian mới nhất.
     * *Cột bên phải (Hộp Tab biên tập)*:
       * **Tab 1: Triệu chứng & Chẩn đoán**: Ô nhập liệu văn bản ghi nhận Lý do khám/Triệu chứng và Chẩn đoán xác định của bác sĩ.
       * **Tab 2: Kê đơn thuốc (Prescription Builder)**: Tìm kiếm dược phẩm thông minh với danh sách gợi ý thuốc có sẵn trong kho, nhập liều lượng, tần suất uống, và số ngày chỉ định. Hỗ trợ thêm/xóa thuốc năng động vào toa.
       * **Tab 3: Thanh toán & Hoàn tất**: Tự động tính toán tổng chi phí dịch vụ và tiền thuốc tương ứng để bác sĩ phê duyệt gửi hóa đơn sang quầy thanh toán.

---

### Phân hệ 5: Quầy cấp phát thuốc Dược sĩ (Pharmacy Desk)
* **Mục đích**: Cấp phát thuốc theo đơn của bác sĩ kê và cập nhật tồn kho dược phẩm.
* **Các tính năng chính**:
  1. **Đơn thuốc chờ xử lý**: Danh sách hiển thị các đơn thuốc có trạng thái `PENDING` được bác sĩ gửi sang.
  2. **Nút "Cấp phát"**: Dược sĩ kiểm tra thuốc thực tế và xác nhận cấp phát. Hệ thống sẽ đổi trạng thái đơn thuốc thành `DISPENSED`, đồng thời tự động **trừ số lượng thuốc tồn kho tương ứng** trong cơ sở dữ liệu.

---

### Phân hệ 6: Quầy thanh toán & Hóa đơn (Billing & Invoices)
* **Mục đích**: Quản lý hóa đơn khám bệnh, thực hiện thu tiền và in biên lai thanh toán.
* **Các tính năng chính**:
  1. **Danh sách hóa đơn phát sinh**: Phân loại hóa đơn Chờ thanh toán (Pending) và Đã thanh toán (Completed).
  2. **Xác nhận thanh toán**: Nút bấm đổi trạng thái hóa đơn thu tiền viện phí thực tế của bệnh nhân.

---

### Phân hệ 7: Đăng ký lịch hẹn Bệnh nhân (Patient Booking)
* **Mục đích**: Cổng thông tin dành cho bệnh nhân tự đặt lịch hẹn khám từ xa.
* **Các tính năng chính**:
  1. **Đặt lịch hẹn khám**: Chọn ngày khám, chọn bác sĩ chuyên khoa phụ trách, và lựa chọn khung giờ trống trong ngày.
  2. **Lịch hẹn của tôi (My Appointments)**: Giúp bệnh nhân theo dõi tình trạng các ca hẹn đã đặt (Đã lên lịch, Đã check-in, Đã hủy).

---

### Phân hệ 8: Danh mục Quản lý chung (Directories)

1. **Thư mục bệnh nhân (Patients Directory)**:
   * Hiển thị bảng tổng hợp toàn bộ hồ sơ bệnh nhân.
   * Bộ lọc nâng cao: Tìm kiếm theo tên/số điện thoại, lọc theo giới tính hoặc trạng thái khám gần đây.
   * **Đặc biệt (Mobile Collapsible Cards)**: Trên điện thoại di động, bảng ngang tự động chuyển đổi thành danh sách thẻ dọc độc lập có nhãn chỉ số, hiển thị nút bấm cân đối giúp nâng cao trải nghiệm người dùng.
   * Form "Thêm bệnh nhân mới" dạng pop-up nền mờ tiện lợi.
2. **Danh mục lịch hẹn (Appointments Master)**: Tra cứu lịch sử tất cả ca hẹn trong phòng khám.
3. **Danh mục hồ sơ bệnh án (EMR Records)**: Tra cứu bệnh án điện tử và các kết luận lâm sàng cũ.
4. **Danh mục kho dược (Medicine Inventory)**: Theo dõi số lượng thuốc hiện có. Tự động hiển thị nhãn cảnh báo màu cam ("Sắp hết hàng") hoặc màu đỏ ("Cần bổ sung") nếu số lượng thuốc thực tế giảm xuống dưới ngưỡng tối thiểu (`minQuantity`).

---

### Phân hệ 9: Quản trị, Thiết lập & Bảo mật

1. **Trang quản trị tài khoản (Admin Panel)**: Phê duyệt tài khoản nhân viên mới đăng ký, khóa/mở hoạt động của người dùng hệ thống.
2. **Nhật ký hệ thống (Audit Logs)**: Ghi nhận thời gian, danh tính người dùng và hành động tác động tới dữ liệu bệnh nhân để phục vụ mục đích kiểm toán bảo mật thông tin y tế.
3. **Bảo mật dữ liệu cá nhân (Data Privacy)**: Hỗ trợ quyền tự quyết dữ liệu của bệnh nhân theo chuẩn bảo mật y tế:
   * Cho phép bệnh nhân xuất và tải về toàn bộ hồ sơ dữ liệu cá nhân dạng tệp `.JSON`.
   * Gửi yêu cầu xóa vĩnh viễn thông tin cá nhân khỏi hệ thống phòng khám.
