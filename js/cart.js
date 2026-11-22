/**
 * ==========================================================================
 * SMART ENROLLMENT - CART & ENROLLMENT LOGIC (js/cart.js)
 * Cổng Đăng ký Môn học Thông minh - Đồ án môn Thiết kế Web
 * Thành viên phụ trách: Nguyễn Tấn Điền (nhánh feature/Dien)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------------
  // 1. CÁC THAM CHIẾU DOM CHÍNH
  // ------------------------------------------------------------------------
  const courseListContainer = document.getElementById("course-list");
  const selectedCoursesBody = document.getElementById("selected-courses-body");
  const totalCreditsEl = document.getElementById("total-credits");
  const creditProgressEl = document.getElementById("credit-progress");
  const progressTrackEl = document.querySelector(".progress-track");
  const creditStatusEl = document.getElementById("credit-status");
  const btnClearCart = document.getElementById("btn-clear-cart");
  const toastContainer = document.getElementById("toast-container");

  // Giới hạn tín chỉ tối đa theo quy định
  const MAX_CREDITS_LIMIT = 25;
  const STANDARD_CREDITS_TARGET = 24;
  const MIN_CREDITS_REQUIRED = 12;

  // ------------------------------------------------------------------------
  // 2. HỆ THỐNG THÔNG BÁO TOAST HIỆN ĐẠI (#toast-container)
  // ------------------------------------------------------------------------
  /**
   * Hiển thị thông báo Toast nổi ở góc màn hình (thay thế alert mặc định).
   * 
   * @param {string} message Nội dung thông báo
   * @param {'success'|'warning'|'error'|'info'} type Loại thông báo
   * @param {string} [title] Tiêu đề tùy chọn
   * @param {number} [duration] Thời gian hiển thị tính bằng milliseconds
   */
  function showToast(message, type = "info", title = "", duration = 4000) {
    if (!toastContainer) {
      console.log(`[Toast ${type}]: ${message}`);
      return;
    }

    // Biểu tượng SVG tương ứng theo từng loại thông báo
    const icons = {
      success: `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`,
      warning: `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>`,
      error: `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>`,
      info: `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>`
    };

    const titles = {
      success: title || "Thành công",
      warning: title || "Cảnh báo đăng ký",
      error: title || "Không thể thực hiện",
      info: title || "Thông báo hệ thống"
    };

    const normalizedType = icons[type] ? type : "info";

    const toast = document.createElement("div");
    toast.className = `toast toast-${normalizedType}`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <div class="toast-icon">
        ${icons[normalizedType]}
      </div>
      <div class="toast-content">
        <div class="toast-title">${titles[normalizedType]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Đóng thông báo">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="toast-timer" style="animation-duration: ${duration}ms;"></div>
    `;

    toastContainer.appendChild(toast);

    // Tự động đóng Toast
    let dismissTimeout = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    // Nút đóng thủ công
    const closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        clearTimeout(dismissTimeout);
        dismissToast(toast);
      });
    }
  }

  /**
   * Đóng Toast mượt mà với hiệu ứng mờ dần
   * @param {HTMLElement} toast 
   */
  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add("toast-hiding");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }

  // Đưa showToast ra window để các module khác (như checkout, schedule) có thể gọi
  window.showToast = showToast;

  // ------------------------------------------------------------------------
  // 3. TIỆN ÍCH PHÂN TÍCH VÀ KIỂM TRA ĐIỀU KIỆN MÔN HỌC
  // ------------------------------------------------------------------------
  /**
   * Phân tích chuỗi lịch học thành đối tượng gồm Thứ và các Tiết.
   * Định dạng chuẩn từ data-schedule: "Thứ 2 (Tiết 1-3)", "Thứ 7 (Tiết 4-5)"
   * 
   * @param {string} scheduleStr 
   * @returns {{day: string, startPeriod: number, endPeriod: number}|null}
   */
  function parseSchedule(scheduleStr) {
    if (!scheduleStr) return null;
    const regex = /(Thứ\s*\d+|Chủ\s*Nhật)\s*\(Tiết\s*(\d+)\s*-\s*(\d+)\)/i;
    const match = scheduleStr.match(regex);
    if (!match) return null;

    return {
      day: match[1].trim().toLowerCase(),
      startPeriod: parseInt(match[2], 10),
      endPeriod: parseInt(match[3], 10)
    };
  }

  /**
   * Kiểm tra xem 2 lịch học có bị xung đột thời gian hay không.
   * 
   * @param {string} scheduleA 
   * @param {string} scheduleB 
   * @returns {boolean}
   */
  function isScheduleConflict(scheduleA, scheduleB) {
    const parsedA = parseSchedule(scheduleA);
    const parsedB = parseSchedule(scheduleB);
    if (!parsedA || !parsedB) return false;

    // Phải cùng thứ
    if (parsedA.day !== parsedB.day) return false;

    // Giao nhau về tiết học
    const hasOverlap = !(parsedA.endPeriod < parsedB.startPeriod || parsedA.startPeriod > parsedB.endPeriod);
    return hasOverlap;
  }

  // ------------------------------------------------------------------------
  // 4. KẾT XUẤT VÀ CẬP NHẬT GIAO DIỆN GIỎ HÀNG
  // ------------------------------------------------------------------------
  /**
   * Tính tổng tín chỉ hiện tại từ mảng môn học.
   * @param {Array} courses 
   * @returns {number}
   */
  function calculateTotalCredits(courses) {
    return courses.reduce((sum, item) => sum + (Number(item.credits) || 0), 0);
  }

  /**
   * Cập nhật thanh tiến độ tín chỉ (#credit-progress) và nhãn trạng thái (#credit-status).
   * @param {number} totalCredits 
   */
  function updateCreditSummaryUI(totalCredits) {
    // 1. Cập nhật số tín chỉ hiển thị
    if (totalCreditsEl) {
      totalCreditsEl.textContent = totalCredits;
    }

    // 2. Cập nhật thanh tiến độ (#credit-progress)
    if (creditProgressEl) {
      const percentage = Math.min(100, Math.round((totalCredits / STANDARD_CREDITS_TARGET) * 100));
      creditProgressEl.style.width = `${percentage}%`;

      // Đổi màu theo ngưỡng yêu cầu:
      // - Bình thường (< 18 TC): Xanh
      // - Cảnh báo vàng (>= 18 TC): Vàng/Cam
      // - Chạm trần (>= 24-25 TC): Đỏ
      creditProgressEl.classList.remove("progress-normal", "progress-warning", "progress-danger");
      if (totalCredits >= 24) {
        creditProgressEl.classList.add("progress-danger");
      } else if (totalCredits >= 18) {
        creditProgressEl.classList.add("progress-warning");
      } else {
        creditProgressEl.classList.add("progress-normal");
      }
    }

    // Cập nhật giá trị aria trên progress track
    if (progressTrackEl) {
      progressTrackEl.setAttribute("aria-valuenow", totalCredits);
    }

    // 3. Cập nhật nhãn trạng thái đăng ký (#credit-status)
    if (creditStatusEl) {
      creditStatusEl.className = "credit-status-badge";
      if (totalCredits === 0) {
        creditStatusEl.textContent = "Chưa đủ tín chỉ tối thiểu (0/12)";
        creditStatusEl.classList.add("status-below-min");
      } else if (totalCredits < MIN_CREDITS_REQUIRED) {
        creditStatusEl.textContent = `Chưa đủ tín chỉ tối thiểu (${totalCredits}/${MIN_CREDITS_REQUIRED})`;
        creditStatusEl.classList.add("status-below-min");
      } else if (totalCredits >= MIN_CREDITS_REQUIRED && totalCredits < 18) {
        creditStatusEl.textContent = `Đạt chuẩn đăng ký (${totalCredits}/${STANDARD_CREDITS_TARGET} TC)`;
        creditStatusEl.classList.add("status-valid");
      } else if (totalCredits >= 18 && totalCredits < STANDARD_CREDITS_TARGET) {
        creditStatusEl.textContent = `Cảnh báo: Tải trọng cao (${totalCredits}/${STANDARD_CREDITS_TARGET} TC)`;
        creditStatusEl.classList.add("status-warning");
      } else {
        creditStatusEl.textContent = `Đã chạm trần tối đa (${totalCredits} TC)`;
        creditStatusEl.classList.add("status-danger");
      }
    }
  }

  /**
   * Render danh sách môn học đã chọn vào bảng #selected-courses-table.
   * @param {Array} courses 
   */
  function renderCartTable(courses) {
    if (!selectedCoursesBody) return;

    // Nếu không có môn nào trong giỏ
    if (!courses || courses.length === 0) {
      selectedCoursesBody.innerHTML = `
        <tr id="cart-empty-row">
          <td colspan="4" style="text-align: center; color: var(--color-text-light); padding: var(--spacing-6) var(--spacing-2);">
            Chưa có môn học nào trong giỏ đăng ký.
          </td>
        </tr>
      `;
      return;
    }

    // Có môn học: dựng từng hàng
    const rowsHtml = courses.map(course => `
      <tr data-id="${course.id}">
        <td>
          <span class="course-code-badge">${course.id}</span>
        </td>
        <td>
          <div class="selected-course-title" title="${course.name}">${course.name}</div>
          <div class="selected-course-schedule">${course.schedule || "Chưa có lịch"}</div>
        </td>
        <td style="text-align: center;">
          <span class="badge-credit">${course.credits} TC</span>
        </td>
        <td style="text-align: center;">
          <button
            type="button"
            class="btn-remove-course"
            data-id="${course.id}"
            title="Xóa môn ${course.name} (${course.id})"
            aria-label="Xóa môn ${course.name}"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>
    `).join("");

    selectedCoursesBody.innerHTML = rowsHtml;
  }

  /**
   * Đồng bộ trạng thái giao diện của các thẻ môn học (.course-card) dựa trên giỏ hàng:
   * - Thêm/xóa class .is-selected
   * - Đổi trạng thái và nhãn nút .btn-add-course
   * @param {Array} courses 
   */
  function syncCourseCardsState(courses) {
    const selectedIds = new Set(courses.map(c => c.id));
    const allCards = document.querySelectorAll(".course-card");

    allCards.forEach(card => {
      const courseId = card.getAttribute("data-id");
      const addBtn = card.querySelector(".btn-add-course");

      if (selectedIds.has(courseId)) {
        card.classList.add("is-selected");
        if (addBtn) {
          addBtn.disabled = true;
          addBtn.classList.add("is-added");
          addBtn.innerHTML = `
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Đã chọn
          `;
        }
      } else {
        card.classList.remove("is-selected");
        if (addBtn) {
          addBtn.disabled = false;
          addBtn.classList.remove("is-added");
          addBtn.innerHTML = `
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Chọn môn
          `;
        }
      }
    });
  }

  /**
   * Làm mới toàn bộ giỏ hàng và đồng bộ giao diện
   */
  function refreshCartUI() {
    const courses = getCoursesFromStorage();
    const totalCredits = calculateTotalCredits(courses);

    renderCartTable(courses);
    updateCreditSummaryUI(totalCredits);
    syncCourseCardsState(courses);
  }

  // ------------------------------------------------------------------------
  // 5. XỬ LÝ SỰ KIỆN: THÊM MÔN HỌC VÀO GIỎ
  // ------------------------------------------------------------------------
  /**
   * Xử lý khi nhấn nút "Chọn môn" (.btn-add-course)
   * @param {HTMLButtonElement} button 
   */
  function handleAddCourse(button) {
    const card = button.closest(".course-card");
    if (!card) return;

    // Đọc toàn bộ thuộc tính data-* từ thẻ môn học
    const newCourse = {
      id: (card.getAttribute("data-id") || "").trim(),
      name: (card.getAttribute("data-name") || "").trim(),
      credits: parseInt(card.getAttribute("data-credits"), 10) || 0,
      prereq: (card.getAttribute("data-prereq") || "").trim(),
      schedule: (card.getAttribute("data-schedule") || "").trim(),
      fee: parseInt(card.getAttribute("data-fee"), 10) || 0
    };

    if (!newCourse.id) {
      showToast("Không tìm thấy thông tin môn học hợp lệ.", "error");
      return;
    }

    const currentCourses = getCoursesFromStorage();

    // 1. Kiểm tra chống đăng ký trùng
    const isAlreadyAdded = currentCourses.some(c => c.id === newCourse.id);
    if (isAlreadyAdded) {
      showToast(`Môn "${newCourse.name}" (${newCourse.id}) đã có trong giỏ đăng ký.`, "warning");
      return;
    }

    // 2. NGĂN CHẶN THÊM MÔN NẾU TỔNG TÍN CHỈ > 25
    const currentTotalCredits = calculateTotalCredits(currentCourses);
    const newTotalCredits = currentTotalCredits + newCourse.credits;
    if (newTotalCredits > MAX_CREDITS_LIMIT) {
      showToast(
        `Không thể đăng ký: Tổng tín chỉ sẽ vượt quá ${MAX_CREDITS_LIMIT} TC! (Hiện có: ${currentTotalCredits} TC + ${newCourse.credits} TC = ${newTotalCredits} TC).`,
        "error",
        "Vượt giới hạn tín chỉ"
      );
      return;
    }

    // 3. Kiểm tra môn tiên quyết (data-prereq)
    if (newCourse.prereq) {
      const hasPrereq = currentCourses.some(c => c.id.toUpperCase() === newCourse.prereq.toUpperCase());
      if (!hasPrereq) {
        showToast(
          `Môn "${newCourse.name}" yêu cầu môn tiên quyết "${newCourse.prereq}". Vui lòng đăng ký môn tiên quyết trước!`,
          "warning",
          "Chưa thỏa điều kiện tiên quyết"
        );
        return;
      }
    }

    // 4. Kiểm tra xung đột lịch học (data-schedule)
    if (newCourse.schedule) {
      const conflictingCourse = currentCourses.find(c => isScheduleConflict(c.schedule, newCourse.schedule));
      if (conflictingCourse) {
        showToast(
          `Trùng lịch học: Môn "${newCourse.name}" (${newCourse.schedule}) bị trùng thời gian với môn "${conflictingCourse.name}" (${conflictingCourse.schedule})!`,
          "warning",
          "Xung đột thời khóa biểu"
        );
        return;
      }
    }

    // Thêm môn vào danh sách và lưu vào localStorage
    currentCourses.push(newCourse);
    saveCoursesToStorage(currentCourses);

    // Cập nhật giao diện tức thời
    refreshCartUI();

    showToast(`Đã thêm môn "${newCourse.name}" (${newCourse.credits} TC) vào giỏ đăng ký.`, "success");
  }

  // Lắng nghe sự kiện click nút .btn-add-course qua Event Delegation tại #course-list
  if (courseListContainer) {
    courseListContainer.addEventListener("click", event => {
      const addBtn = event.target.closest(".btn-add-course");
      if (addBtn && !addBtn.disabled) {
        event.preventDefault();
        handleAddCourse(addBtn);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. XỬ LÝ SỰ KIỆN: XÓA TỪNG MÔN VÀ XÓA TẤT CẢ
  // ------------------------------------------------------------------------
  /**
   * Xóa một môn học khỏi giỏ hàng theo mã môn
   * @param {string} courseId 
   */
  function removeCourse(courseId) {
    if (!courseId) return;

    let currentCourses = getCoursesFromStorage();
    const courseToRemove = currentCourses.find(c => c.id === courseId);
    if (!courseToRemove) return;

    // Kiểm tra xem môn này có đang là tiên quyết của môn nào khác trong giỏ không
    const dependentCourses = currentCourses.filter(c => c.prereq && c.prereq.toUpperCase() === courseId.toUpperCase());
    if (dependentCourses.length > 0) {
      const depNames = dependentCourses.map(c => c.name).join(", ");
      showToast(
        `Không thể xóa: Môn "${courseToRemove.name}" là tiên quyết cho môn đang chọn (${depNames}). Vui lòng xóa môn phụ thuộc trước!`,
        "warning",
        "Ràng buộc tiên quyết"
      );
      return;
    }

    // Thực hiện xóa
    currentCourses = currentCourses.filter(c => c.id !== courseId);
    saveCoursesToStorage(currentCourses);

    // Cập nhật lại giao diện
    refreshCartUI();

    showToast(`Đã xóa môn "${courseToRemove.name}" khỏi giỏ đăng ký.`, "info");
  }

  // Lắng nghe sự kiện click nút .btn-remove-course qua Event Delegation tại #selected-courses-body
  if (selectedCoursesBody) {
    selectedCoursesBody.addEventListener("click", event => {
      const removeBtn = event.target.closest(".btn-remove-course");
      if (removeBtn) {
        event.preventDefault();
        const courseId = removeBtn.getAttribute("data-id");
        removeCourse(courseId);
      }
    });
  }

  // Xóa toàn bộ giỏ hàng (#btn-clear-cart)
  if (btnClearCart) {
    btnClearCart.addEventListener("click", event => {
      event.preventDefault();
      const currentCourses = getCoursesFromStorage();

      if (currentCourses.length === 0) {
        showToast("Giỏ đăng ký hiện đang trống.", "info");
        return;
      }

      clearCoursesStorage();
      refreshCartUI();
      showToast("Đã xóa toàn bộ môn học trong giỏ đăng ký.", "info");
    });
  }

  // ------------------------------------------------------------------------
  // 7. KHỞI TẠO VÀ TỰ ĐỘNG KHÔI PHỤC KHI TẢI LẠI TRANG
  // ------------------------------------------------------------------------
  refreshCartUI();
});
