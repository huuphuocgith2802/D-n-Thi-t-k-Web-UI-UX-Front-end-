# 📋 BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN (PROJECT PROGRESS TRACKER)

> **Dự án:** Cổng Đăng ký Môn học Thông minh (Smart Enrollment)  
> **Cập nhật lần cuối:** 22/11/2026  
> **Trạng thái chung:** Đang triển khai (In Progress)

---

## 📊 1. TỔNG QUAN TIẾN ĐỘ THÀNH VIÊN

| Thành viên | Vai trò | Nhánh Git | Tiến độ | Trạng thái |
|:---|:---|:---|:---:|:---:|
| **Đinh Hữu Phước** | Nhóm trưởng / Frontend Core | `feature/Phuoc` | **85%** | 🟢 Đang hoàn thiện |
| **Nguyễn Tấn Điền** | Thành viên / Enrollment & Storage | `feature/Dien` | **10%** | 🟡 Đang thực hiện |
| **Nguyễn Thành Phát** | Thành viên / Subpages & Checkout | `feature/Phat` | **10%** | 🟡 Đang thực hiện |

---

## 👤 2. CHECKLIST CHI TIẾT THEO THÀNH VIÊN

### 🔵 Thành viên 1: Đinh Hữu Phước (`feature/Phuoc`)
> **Tập tin phụ trách:** `index.html`, `css/base.css`, `README.md`, `TASKS.md`, `js/search.js`

- [x] **Quản trị & Khởi tạo dự án:**
  - [x] Thiết lập cấu trúc thư mục chuẩn theo quy tắc phân quyền 1 file - 1 chủ sở hữu.
  - [x] Soạn thảo tài liệu quản trị dự án toàn diện trong `README.md` (mô tả, quy tắc, bảng phân công, link GitHub Pages).
  - [x] Xây dựng bảng theo dõi tiến độ chi tiết trong `TASKS.md`.
- [x] **Xây dựng Foundation Styles (`css/base.css`):**
  - [x] Thiết lập hệ thống Design Tokens (CSS Variables): bảng màu hiện đại, phông chữ sans-serif & mono, khoảng cách, bo góc và đổ bóng.
  - [x] Chuẩn hóa CSS Reset & kiểu dáng cơ sở cho toàn trang.
  - [x] Thiết kế thanh điều hướng Header cố định (Sticky Header) với logo và 3 liên kết: `index.html`, `pages/schedule.html`, `pages/checkout.html`.
  - [x] Xây dựng Layout 2 cột đáp ứng (Two-column Responsive Grid): Cột nội dung chính và Cột giỏ hàng bên cạnh (Sticky Sidebar).
  - [x] Định dạng cơ bản cho các thành phần dùng chung: Nút bấm (`.btn`), Ô nhập liệu (`.form-input`), Bảng (`#selected-courses-table`), Thanh tiến độ tín chỉ (`#credit-progress`), Khung thông báo rỗng (`#empty-search-msg`) và Toast container (`#toast-container`).
  - [x] Viết Media Queries tối ưu cho màn hình Tablet và Mobile.
- [x] **Xây dựng Cấu trúc Trang chủ (`index.html`):**
  - [x] Nhúng đúng các stylesheet: `css/base.css` và `css/enrollment.css`.
  - [x] Nhúng đúng các script với thuộc tính `defer`: `js/storage.js`, `js/search.js`, `js/cart.js`.
  - [x] Xây dựng thanh điều hướng Header chuẩn Semantic HTML5 với 3 link.
  - [x] Tạo Form tìm kiếm (`#search-form`) gồm ô nhập từ khóa (`#search-input`) và bộ lọc tín chỉ (`#credit-filter`).
  - [x] Khởi tạo khung hiển thị thông báo không tìm thấy kết quả (`#empty-search-msg`).
  - [x] Xây dựng danh sách 12 môn học CNTT thực tế (`#course-list`) với các thẻ `<article class="course-card">` gắn đầy đủ thuộc tính `data-id`, `data-name`, `data-credits`, `data-prereq`, `data-schedule`, `data-fee`.
  - [x] Thêm nút hành động `<button type="button" class="btn-add-course">Chọn môn</button>` trong từng thẻ môn học.
  - [x] Tạo khung sẵn cho Bảng giỏ hàng môn học (`table#selected-courses-table`, `tbody#selected-courses-body`).
  - [x] Tạo vùng hiển thị tổng tín chỉ (`span#total-credits`), thanh tiến độ (`div#credit-progress`), nhãn trạng thái (`span#credit-status`), nút xóa giỏ hàng (`button#btn-clear-cart`).
  - [x] Tạo phần tử vùng chứa thông báo nổi (`div#toast-container`).
- [ ] **Hiện thực Logic Tìm kiếm & Lọc (`js/search.js`):**
  - [ ] Lắng nghe sự kiện `input` trên `#search-input` để lọc theo tên hoặc mã môn học (không phân biệt chữ hoa/thường).
  - [ ] Lắng nghe sự kiện `change` trên `#credit-filter` để lọc theo số tín chỉ.
  - [ ] Kết hợp cả 2 điều kiện tìm kiếm và hiển thị/ẩn thẻ môn học phù hợp.
  - [ ] Tự động hiển thị `#empty-search-msg` khi không có môn học nào thỏa điều kiện và ẩn đi khi có kết quả.
- [ ] **Tích hợp & Kiểm thử Hệ thống:**
  - [ ] Phối hợp kiểm thử tích hợp (Integration Test) sau khi 2 thành viên nộp PR.
  - [ ] Đánh giá mã nguồn (Code Review) và tiến hành merge vào nhánh `main`.
  - [ ] Cấu hình GitHub Pages và kiểm tra tính năng thực tế trên môi trường live.

---

### 🟡 Thành viên 2: Nguyễn Tấn Điền (`feature/Dien`)
> **Tập tin phụ trách:** `css/enrollment.css`, `js/storage.js`, `js/cart.js`

- [ ] **Thiết kế Giao diện Chi tiết Đăng ký (`css/enrollment.css`):**
  - [ ] Thiết kế kiểu dáng chi tiết cho thẻ môn học (`.course-card`), hiệu ứng hover, badge môn tiên quyết và trạng thái đã được chọn (`.is-selected`).
  - [ ] Tinh chỉnh kiểu dáng bảng giỏ hàng (`#selected-courses-table`), hàng dữ liệu và nút xóa từng môn (`.btn-remove-course`).
  - [ ] Định kiểu màu sắc động cho thanh tiến độ tín chỉ (Xanh khi hợp lệ, Cam khi chưa đủ, Đỏ khi vượt quá).
  - [ ] Định dạng chi tiết cho các thẻ thông báo nổi (`.toast`, `.toast-success`, `.toast-warning`, `.toast-error`).
- [ ] **Xây dựng Module Lưu trữ Dữ liệu (`js/storage.js`):**
  - [ ] Định nghĩa `STORAGE_KEY` trong `localStorage` để lưu danh sách môn học đã đăng ký.
  - [ ] Viết hàm `getCoursesFromStorage()`: Đọc và parse dữ liệu an toàn từ `localStorage`.
  - [ ] Viết hàm `saveCoursesToStorage(courses)`: Lưu danh sách môn học vào `localStorage`.
  - [ ] Viết hàm `clearCoursesStorage()`: Xóa sạch dữ liệu giỏ môn học trong `localStorage`.
- [ ] **Hiện thực Logic Giỏ hàng & Kiểm tra Điều kiện (`js/cart.js`):**
  - [ ] Nạp danh sách môn học từ `localStorage` khi trang khởi động và hiển thị vào `#selected-courses-body`.
  - [ ] Bắt sự kiện nhấp nút `.btn-add-course`: trích xuất dữ liệu từ các thuộc tính `data-*` của thẻ môn học.
  - [ ] **Kiểm tra môn trùng lặp:** Ngăn chặn thêm môn học đã có trong giỏ hàng.
  - [ ] **Kiểm tra môn tiên quyết (`data-prereq`):** Cảnh báo nếu môn học yêu cầu môn tiên quyết nhưng môn đó chưa có trong danh sách đã chọn.
  - [ ] **Kiểm tra xung đột lịch học (`data-schedule`):** Phát hiện và cảnh báo nếu lịch học của môn mới trùng thứ và tiết với môn đã có trong giỏ.
  - [ ] **Kiểm tra giới hạn tín chỉ:** Giới hạn tối đa 24 tín chỉ/học kỳ.
  - [ ] Cập nhật số tín chỉ tức thời vào `#total-credits`.
  - [ ] Cập nhật độ rộng phần trăm của `#credit-progress` và nhãn thông báo `#credit-status` (Tối thiểu 12 TC, Tối đa 24 TC).
  - [ ] Xử lý sự kiện xóa từng môn học trong bảng và hoàn trả trạng thái nút "Chọn môn".
  - [ ] Bắt sự kiện `#btn-clear-cart` để xóa toàn bộ giỏ hàng và làm mới giao diện.
  - [ ] Xây dựng hàm hiển thị thông báo Toast (`showToast(message, type)`) xuất hiện tại `#toast-container`.

---

### 🟣 Thành viên 3: Nguyễn Thành Phát (`feature/Phat`)
> **Tập tin phụ trách:** `pages/schedule.html`, `pages/checkout.html`, `css/subpages.css`, `js/schedule.js`, `js/checkout.js`

- [ ] **Xây dựng Trang Thời khóa biểu Tuần (`pages/schedule.html`):**
  - [ ] Kế thừa cấu trúc Header, Navigation và Footer đồng bộ với `index.html`.
  - [ ] Xây dựng bảng ma trận Thời khóa biểu (Thứ 2 đến Thứ 7, các ca học / tiết học từ Tiết 1 đến Tiết 10).
  - [ ] Tạo vùng trống thông báo khi sinh viên chưa đăng ký môn học nào.
  - [ ] Tạo các nút chức năng: "In thời khóa biểu" (`window.print()`), "Quay lại đăng ký môn".
- [ ] **Xây dựng Trang Thanh toán Học phí (`pages/checkout.html`):**
  - [ ] Kế thừa cấu trúc Header, Navigation và Footer chuẩn hệ thống.
  - [ ] Hiển thị bảng kê chi tiết các môn học đã đăng ký kèm số tín chỉ và đơn giá từng môn.
  - [ ] Hiển thị tổng số tiền học phí cần đóng (tính tổng từ `data-fee`).
  - [ ] Tạo biểu mẫu thông tin sinh viên và chọn phương thức thanh toán (Chuyển khoản QR Napas, Thẻ sinh viên, Ví điện tử).
  - [ ] Tạo nút "Xác nhận đóng học phí" và Modal/Thông báo hoàn tất thủ tục đăng ký.
- [ ] **Thiết kế Giao diện Trang Phụ (`css/subpages.css`):**
  - [ ] Định kiểu cho lưới thời khóa biểu tuần (Grid Schedule), ô học phần có màu sắc nhận diện trực quan.
  - [ ] Định kiểu cho hóa đơn thanh toán học phí, bảng kê tiền và khu vực quét mã QR.
  - [ ] Tối ưu giao diện khi in ấn (`@media print`).
- [ ] **Hiện thực Logic Hiển thị Thời khóa biểu (`js/schedule.js`):**
  - [ ] Đọc danh sách môn học đã đăng ký từ `localStorage`.
  - [ ] Phân tích chuỗi `data-schedule` (VD: "Thứ 2 (Tiết 1-3)") để xác định tọa độ Thứ và Tiết trên bảng ma trận.
  - [ ] Điền thẻ môn học vào đúng ô thời khóa biểu tương ứng với màu sắc nổi bật.
- [ ] **Hiện thực Logic Thanh toán Học phí (`js/checkout.js`):**
  - [ ] Đọc dữ liệu môn học đã chọn từ `localStorage`.
  - [ ] Tính tổng học phí và định dạng đơn vị tiền tệ VND (VD: `5.400.000 đ`).
  - [ ] Xử lý biểu mẫu thanh toán, kiểm tra tính hợp lệ và thông báo đăng ký học phần thành công.
  - [ ] Cung cấp nút lưu biên lai hoặc làm trống giỏ hàng sau khi hoàn tất thanh toán.

---

## 🔍 3. QUY TRÌNH KIỂM THỬ VÀ BÀN GIAO (ACCEPTANCE CRITERIA)

- [ ] **Quy tắc phân quyền:** Đảm bảo không có bất kỳ commit nào xâm phạm chéo vào file của thành viên khác.
- [ ] **Kiểm thử Responsive:** Giao diện hiển thị hoàn hảo trên màn hình Mobile (375px), Tablet (768px) và Desktop (1440px).
- [ ] **Kiểm thử Đồng bộ Dữ liệu:** Khi thêm môn tại `index.html`, dữ liệu lập tức cập nhật sang `pages/schedule.html` và `pages/checkout.html` thông qua `localStorage`.
- [ ] **Kiểm thử Logic:** 
  - Không cho phép chọn trùng môn.
  - Cảnh báo khi môn tiên quyết chưa chọn.
  - Cảnh báo khi 2 môn trùng lịch học.
  - Cảnh báo khi chưa đủ 12 tín chỉ hoặc vượt quá 24 tín chỉ.
- [ ] **Triển khai GitHub Pages:** Toàn bộ liên kết hoạt động chính xác khi chạy trên GitHub Pages.
