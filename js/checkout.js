/**
 * ==========================================================================
 * SMART ENROLLMENT - CHECKOUT & PAYMENT LOGIC (js/checkout.js)
 * Cổng Đăng ký Môn học Thông minh - Đồ án môn Thiết kế Web
 * Thành viên phụ trách: Nguyễn Thành Phát (nhánh feature/Phat)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------------
  // 1. CÁC THAM CHIẾU DOM
  // ------------------------------------------------------------------------
  const emptyCheckoutState = document.getElementById("empty-checkout-state");
  const checkoutContentContainer = document.getElementById("checkout-content-container");
  const checkoutCoursesBody = document.getElementById("checkout-courses-body");
  const checkoutTotalCredits = document.getElementById("checkout-total-credits");
  const checkoutTotalAmount = document.getElementById("checkout-total-amount");
  const qrAmountText = document.getElementById("qr-amount-text");
  const qrMemoText = document.getElementById("qr-memo-text");
  const qrCodeImg = document.getElementById("qr-code-img");
  const qrLoadingSpinner = document.getElementById("qr-loading-spinner");
  const btnPrintBill = document.getElementById("btn-print-bill");
  const btnConfirmPayment = document.getElementById("btn-confirm-payment");
  const paymentSuccessModal = document.getElementById("payment-success-modal");
  const btnPrintReceipt = document.getElementById("btn-print-receipt");
  const btnCloseModal = document.getElementById("btn-close-modal");

  // Các trường trong Modal biên lai
  const receiptTransId = document.getElementById("receipt-trans-id");
  const receiptTime = document.getElementById("receipt-time");
  const receiptTotalCourses = document.getElementById("receipt-total-courses");
  const receiptTotalCredits = document.getElementById("receipt-total-credits");
  const receiptTotalAmount = document.getElementById("receipt-total-amount");

  // Phương thức thanh toán radio options
  const paymentMethodOptions = document.querySelectorAll(".payment-method-option");

  // Đơn giá tiêu chuẩn (nếu môn học chưa có data-fee: 450.000 đ / tín chỉ)
  const TUITION_PER_CREDIT = 450000;

  // ------------------------------------------------------------------------
  // 2. ĐỊNH DẠNG TIỀN TỆ VND
  // ------------------------------------------------------------------------
  /**
   * Định dạng số tiền sang chuẩn tiền tệ Việt Nam (Ví dụ: 1.350.000 đ)
   * @param {number} amount 
   * @returns {string}
   */
  function formatVND(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + " đ";
  }

  // ------------------------------------------------------------------------
  // 3. KẾT XUẤT BẢNG KÊ CHI TIẾT HỌC PHÍ
  // ------------------------------------------------------------------------
  /**
   * Render chi tiết các học phần đã đăng ký và tính tổng học phí
   * @param {Array} courses 
   */
  function renderBillTable(courses) {
    if (!checkoutCoursesBody) return;

    let totalCredits = 0;
    let totalFee = 0;

    const rowsHtml = courses.map((course, index) => {
      const credits = Number(course.credits) || 0;
      // Tính học phí theo data-fee của môn hoặc đơn giá tín chỉ
      const fee = Number(course.fee) > 0 ? Number(course.fee) : credits * TUITION_PER_CREDIT;

      totalCredits += credits;
      totalFee += fee;

      return `
        <tr>
          <td style="color: var(--color-text-light); font-weight: 500;">${index + 1}</td>
          <td><span class="course-code-badge">${course.id}</span></td>
          <td>
            <strong>${course.name}</strong>
          </td>
          <td style="text-align: center;">
            <span class="badge-credit">${credits} TC</span>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--color-text-muted);">${course.schedule || 'Chưa có lịch'}</span>
          </td>
          <td style="text-align: right; font-weight: 600; color: var(--color-text-main);">
            ${formatVND(fee)}
          </td>
        </tr>
      `;
    }).join("");

    checkoutCoursesBody.innerHTML = rowsHtml;

    // Cập nhật dòng tổng cộng
    if (checkoutTotalCredits) {
      checkoutTotalCredits.textContent = `${totalCredits} TC`;
    }
    if (checkoutTotalAmount) {
      checkoutTotalAmount.textContent = formatVND(totalFee);
    }

    return { totalCredits, totalFee };
  }

  // ------------------------------------------------------------------------
  // 4. TẠO MÃ QR THANH TOÁN ĐỘNG (VIETQR NAPAS)
  // ------------------------------------------------------------------------
  /**
   * Khởi tạo mã QR thanh toán theo chuẩn VietQR với số tiền tương ứng
   * @param {number} totalFee 
   */
  function generateQRCode(totalFee) {
    const bankId = "970418"; // BIDV
    const accountNo = "1250002608888";
    const template = "compact";
    const memo = "SV125000260 DANG KY HP";
    const accountName = "TRUONG DAI HOC";

    if (qrAmountText) {
      qrAmountText.textContent = formatVND(totalFee);
    }
    if (qrMemoText) {
      qrMemoText.textContent = memo;
    }

    if (qrCodeImg) {
      if (qrLoadingSpinner) qrLoadingSpinner.classList.remove("is-hidden");

      // Sử dụng VietQR Quick Link API
      const vietQrUrl = `https://api.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${totalFee}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

      const img = new Image();
      img.onload = () => {
        qrCodeImg.src = vietQrUrl;
        if (qrLoadingSpinner) qrLoadingSpinner.classList.add("is-hidden");
      };
      img.onerror = () => {
        // Fallback tạo mã QR dự phòng nếu mạng offline
        console.warn("[checkout.js] Không tải được VietQR trực tuyến. Sử dụng QR dự phòng.");
        qrCodeImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(`2|99|0988888888|${accountName}||0|0|${totalFee}|${memo}|transfer_p2p`)}&size=220`;
        if (qrLoadingSpinner) qrLoadingSpinner.classList.add("is-hidden");
      };
      img.src = vietQrUrl;
    }
  }

  // ------------------------------------------------------------------------
  // 5. CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN
  // ------------------------------------------------------------------------
  paymentMethodOptions.forEach(option => {
    option.addEventListener("click", () => {
      paymentMethodOptions.forEach(opt => opt.classList.remove("active"));
      option.classList.add("active");

      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. XÁC NHẬN THANH TOÁN & HIỂN THỊ BIÊN LAI
  // ------------------------------------------------------------------------
  if (btnConfirmPayment) {
    btnConfirmPayment.addEventListener("click", () => {
      const courses = typeof getCoursesFromStorage === "function" ? getCoursesFromStorage() : [];
      if (courses.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
      }

      const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
      const totalFee = courses.reduce((sum, c) => {
        const fee = Number(c.fee) > 0 ? Number(c.fee) : (Number(c.credits) || 0) * TUITION_PER_CREDIT;
        return sum + fee;
      }, 0);

      // Sinh mã giao dịch ngẫu nhiên
      const now = new Date();
      const dateStr = now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
      const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const txnCode = "TXN-" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "-" + Math.floor(1000 + Math.random() * 9000);

      if (receiptTransId) receiptTransId.textContent = txnCode;
      if (receiptTime) receiptTime.textContent = `${dateStr} ${timeStr}`;
      if (receiptTotalCourses) receiptTotalCourses.textContent = `${courses.length} môn học`;
      if (receiptTotalCredits) receiptTotalCredits.textContent = `${totalCredits} TC`;
      if (receiptTotalAmount) receiptTotalAmount.textContent = formatVND(totalFee);

      // Hiển thị modal thành công
      if (paymentSuccessModal) {
        paymentSuccessModal.classList.remove("is-hidden");
      }
    });
  }

  // Đóng modal
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
      if (paymentSuccessModal) {
        paymentSuccessModal.classList.add("is-hidden");
      }
    });
  }

  // In biên lai
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener("click", () => {
      window.print();
    });
  }

  // In phiếu đăng ký từ bảng kê
  if (btnPrintBill) {
    btnPrintBill.addEventListener("click", () => {
      window.print();
    });
  }

  // ------------------------------------------------------------------------
  // 7. KHỞI TẠO TRANG THANH TOÁN
  // ------------------------------------------------------------------------
  function initCheckoutPage() {
    const courses = typeof getCoursesFromStorage === "function" ? getCoursesFromStorage() : [];

    if (!courses || courses.length === 0) {
      if (emptyCheckoutState) emptyCheckoutState.classList.remove("is-hidden");
      if (checkoutContentContainer) checkoutContentContainer.classList.add("is-hidden");
      return;
    }

    if (emptyCheckoutState) emptyCheckoutState.classList.add("is-hidden");
    if (checkoutContentContainer) checkoutContentContainer.classList.remove("is-hidden");

    // Render bảng hóa đơn và tạo mã QR
    const { totalFee } = renderBillTable(courses);
    generateQRCode(totalFee);
  }

  initCheckoutPage();
});
