# 🎓 CỔNG ĐĂNG KÝ MÔN HỌC THÔNG MINH (SMART ENROLLMENT)

> **Đồ án môn học:** Thiết kế Web  
> **Nhóm thực hiện:** Nhóm 03 thành viên  
> **Chủ đề:** Hệ thống Cổng Đăng ký Môn học Thông minh ngành Công nghệ Thông tin (Smart Enrollment Web Portal)

---

## 🌐 1. TRẢI NGHIỆM TRỰC TIẾP (LIVE DEMO)

* **GitHub Pages URL:** `https://[username].github.io/smarterollment/`  
  *(Vui lòng thay thế `[username]` bằng tài khoản GitHub chứa repository sau khi bật chế độ GitHub Pages từ nhánh `main`)*
* **Trạng thái triển khai:** [![GitHub Pages Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen?logo=github)](https://github.com)

---

## 📖 2. TỔNG QUAN DỰ ÁN

**Smart Enrollment** là ứng dụng web hiện đại hỗ trợ sinh viên ngành Công nghệ Thông tin tra cứu, lựa chọn và đăng ký các môn học trong học kỳ một cách trực quan, chính xác và nhanh chóng. Hệ thống tích hợp các cơ chế kiểm tra điều kiện tiên quyết, cảnh báo xung đột thời khóa biểu, theo dõi tổng số tín chỉ đăng ký và mô phỏng quy trình thanh toán học phí.

### ✨ Các tính năng trọng tâm:
1. **Tìm kiếm & Lọc môn học thông minh:** Lọc theo mã môn/tên môn thời gian thực, lọc nhanh theo số tín chỉ (2, 3, 4 tín chỉ).
2. **Danh mục học phần thực tế:** Cung cấp 12 môn học tiêu chuẩn ngành CNTT với đầy đủ thuộc tính dữ liệu (`data-id`, `data-name`, `data-credits`, `data-prereq`, `data-schedule`, `data-fee`).
3. **Giỏ đăng ký học phần & Kiểm soát tín chỉ:** Thêm/xóa môn học vào giỏ, kiểm tra ngưỡng tín chỉ tối thiểu (12 TC) và tối đa (24 TC), thanh tiến độ trực quan.
4. **Kiểm tra logic thông minh:** Phát hiện trùng lịch học và cảnh báo môn tiên quyết chưa hoàn thành.
5. **Thời khóa biểu tuần trực quan:** Hiển thị lịch biểu của các môn học đã chọn theo dạng ma trận thứ/tiết.
6. **Thanh toán học phí & Hóa đơn:** Tổng hợp học phí theo tín chỉ và mô phỏng giao dịch thanh toán xác nhận đăng ký.

---

## 🛡️ 3. QUY TẮC QUẢN TRỊ DỰ ÁN: "1 FILE - 1 CHỦ SỞ HỮU" (SINGLE OWNERSHIP PRINCIPLE)

Nhằm tối ưu hóa hiệu suất làm việc nhóm, loại bỏ triệt để xung đột mã nguồn (**Git Merge Conflicts**) và đảm bảo tính minh bạch về trách nhiệm, dự án áp dụng nghiêm ngặt quy tắc:

### 3.1. Nguyên tắc cốt lõi:
- **Phân quyền độc quyền:** Mỗi tập tin mã nguồn (HTML, CSS, JS) chỉ do **đúng 01 thành viên duy nhất** tạo mới, chỉnh sửa và chịu trách nhiệm bảo trì.
- **Không can thiệp chéo:** Thành viên tuyệt đối không được sửa đổi, tái cấu trúc hoặc ghi đè tập tin thuộc quyền quản lý của thành viên khác trừ khi có sự đồng thuận chính thức từ nhóm trưởng và toàn đội.
- **Giao tiếp qua API & Data Contract:** Các thành viên phối hợp thông qua giao ước dữ liệu định sẵn (các thuộc tính `data-*`, cấu trúc `localStorage`, ID và class phần tử chuẩn đã thỏa thuận trong `index.html` và `css/base.css`).

### 3.2. Quy trình làm việc với Git & GitHub:
```
[main] ───────────────────────────────────────────────────────────► (Production)
   │
   ├── feature/Phuoc ──► [Commit] ──► [Pull Request] ──► [Review] ──┘
   ├── feature/Dien  ──► [Commit] ──► [Pull Request] ──► [Review] ──┘
   └── feature/Phat  ──► [Commit] ──► [Pull Request] ──► [Review] ──┘
```
1. Mỗi thành viên làm việc trên nhánh độc lập:
   - `feature/Phuoc` cho Đinh Hữu Phước
   - `feature/Dien` cho Nguyễn Tấn Điền
   - `feature/Phat` cho Nguyễn Thành Phát
2. Chuẩn đặt tên commit theo **Conventional Commits**:
   - `feat: thêm chức năng mới`
   - `fix: sửa lỗi logic hoặc hiển thị`
   - `style: định kiểu CSS`
   - `docs: cập nhật tài liệu dự án`
3. Tạo Pull Request (PR) về nhánh `main` khi hoàn thành task và yêu cầu thành viên khác duyệt mã (Code Review).

---

## 👥 4. BẢNG PHÂN CÔNG NHIỆM VỤ CHI TIẾT (3 THÀNH VIÊN)

| STT | Họ và Tên | Nhánh Git | Tập tin độc quyền phụ trách | Nhiệm vụ chi tiết |
|:---:|:---|:---|:---|:---|
| **1** | **Đinh Hữu Phước** *(Trưởng nhóm)* | `feature/Phuoc` | `index.html`<br>`css/base.css`<br>`README.md`<br>`TASKS.md`<br>`js/search.js` | • Thiết kế khung kiến trúc tổng thể, Semantic HTML5 trang chủ `index.html`.<br>• Xây dựng hệ thống Design Tokens (CSS Variables), Reset CSS và Layout 2 cột responsive trong `css/base.css`.<br>• Tạo 12 thẻ môn học chuẩn CNTT với đầy đủ thuộc tính `data-*`.<br>• Dựng sẵn khung tìm kiếm `#search-form`, `#empty-search-msg`, giỏ hàng `#selected-courses-table`, `#credit-progress` và `#toast-container`.<br>• Lập tài liệu báo cáo `README.md`, `TASKS.md` và hiện thực logic tìm kiếm/lọc `js/search.js`. |
| **2** | **Nguyễn Tấn Điền** | `feature/Dien` | `css/enrollment.css`<br>`js/storage.js`<br>`js/cart.js` | • Định kiểu chi tiết cho các thẻ môn học, trạng thái hover/active và bảng giỏ hàng trong `css/enrollment.css`.<br>• Xây dựng module `js/storage.js` xử lý đọc/ghi và đồng bộ trạng thái môn học vào `localStorage`.<br>• Xây dựng kịch bản `js/cart.js`: thêm/xóa môn học khỏi giỏ, tính tổng tín chỉ `#total-credits`, tính tổng học phí.<br>• Kiểm tra ràng buộc môn tiên quyết (`data-prereq`) và phát hiện xung đột lịch học (`data-schedule`).<br>• Cập nhật thanh tiến độ tín chỉ `#credit-progress`, thông báo `#toast-container` và nút xóa giỏ `#btn-clear-cart`. |
| **3** | **Nguyễn Thành Phát** | `feature/Phat` | `pages/schedule.html`<br>`pages/checkout.html`<br>`css/subpages.css`<br>`js/schedule.js`<br>`js/checkout.js` | • Xây dựng trang hiển thị thời khóa biểu tuần `pages/schedule.html` dạng bảng lưới trực quan.<br>• Xây dựng trang xác nhận đăng ký & hóa đơn học phí `pages/checkout.html`.<br>• Thiết kế giao diện và hiệu ứng cho các trang con trong `css/subpages.css`.<br>• Hiện thực kịch bản `js/schedule.js` nạp môn từ `localStorage` và vẽ ma trận thời khóa biểu.<br>• Hiện thực kịch bản `js/checkout.js` hiển thị biên lai chi tiết, mã QR thanh toán và xác nhận hoàn tất đăng ký học phần. |

---

## 📁 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```
smarterollment/
│
├── index.html                   # [Đinh Hữu Phước] Trang chủ: Danh mục môn học, tìm kiếm, giỏ học phần
├── README.md                    # [Đinh Hữu Phước] Báo cáo quản trị dự án, quy tắc phân quyền, hướng dẫn
├── TASKS.md                     # [Đinh Hữu Phước] Bảng theo dõi tiến độ chi tiết của 3 thành viên
│
├── css/
│   ├── base.css                 # [Đinh Hữu Phước] CSS variables, reset CSS, header, 2-column layout, base components
│   ├── enrollment.css           # [Nguyễn Tấn Điền] Chi tiết styles thẻ môn học, giỏ hàng, toast notification
│   └── subpages.css             # [Nguyễn Thành Phát] Styles chuyên biệt cho trang TKB và Thanh toán học phí
│
├── js/
│   ├── storage.js               # [Nguyễn Tấn Điền] Module quản lý localStorage (lưu/lấy môn học đã chọn)
│   ├── search.js                # [Đinh Hữu Phước] Xử lý tìm kiếm theo từ khóa và lọc theo số tín chỉ
│   ├── cart.js                  # [Nguyễn Tấn Điền] Xử lý giỏ hàng, tính tín chỉ, kiểm tra môn tiên quyết & trùng lịch
│   ├── schedule.js              # [Nguyễn Thành Phát] Render ma trận thời khóa biểu tuần từ dữ liệu đã lưu
│   └── checkout.js              # [Nguyễn Thành Phát] Tính toán chi phí, xử lý biểu mẫu thanh toán học phí
│
└── pages/
    ├── schedule.html            # [Nguyễn Thành Phát] Trang xem thời khóa biểu tuần trực quan
    └── checkout.html            # [Nguyễn Thành Phát] Trang tổng kết đăng ký, chi tiết hóa đơn & thanh toán
```

---

## 🛠️ 6. HƯỚNG DẪN CÀI ĐẶT & CHẠY THỬ (LOCAL DEVELOPMENT)

### Yêu cầu môi trường:
- Trình duyệt web hiện đại: Google Chrome, Microsoft Edge, Mozilla Firefox hoặc Safari (hỗ trợ ES6 và CSS Grid).
- Không cần cài đặt NodeJS hay backend server (ứng dụng Client-side thuần túy).

### Các bước chạy thử:
1. **Clone repository:**
   ```bash
   git clone https://github.com/[username]/smarterollment.git
   cd smarterollment
   ```
2. **Mở trực tiếp trên trình duyệt:**
   - Cách 1: Nhấp đúp trực tiếp vào file `index.html`.
   - Cách 2: Sử dụng extension **Live Server** trong Visual Studio Code (nhấp chuột phải vào `index.html` chọn *Open with Live Server*).

---

## 📑 7. TIÊU CHUẨN THIẾT KẾ VÀ TRUY CẬP (A11Y & RESPONSIVE)

- **Semantic HTML5:** Sử dụng đúng ngữ nghĩa các thẻ `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- **CSS Variables:** Toàn bộ bảng màu, phông chữ, khoảng cách và độ cong bo góc được quản lý tập trung tại `:root` trong `css/base.css`.
- **Responsive Web Design:** Tương thích trên cả thiết bị di động (Mobile < 768px), máy tính bảng (Tablet 768px - 1024px) và máy tính để bàn (Desktop > 1024px).
- **Trợ năng (Accessibility):** Có đầy đủ nhãn `aria-label`, `role`, cấu trúc tương phản màu sắc đạt chuẩn WCAG AA.
