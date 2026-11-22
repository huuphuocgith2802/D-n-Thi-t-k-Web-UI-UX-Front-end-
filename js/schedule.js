/**
 * ==========================================================================
 * SMART ENROLLMENT - SCHEDULE LOGIC (js/schedule.js)
 * Cổng Đăng ký Môn học Thông minh - Đồ án môn Thiết kế Web
 * Thành viên phụ trách: Nguyễn Thành Phát (nhánh feature/Phat)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------------
  // 1. CÁC THAM CHIẾU DOM
  // ------------------------------------------------------------------------
  const emptyScheduleState = document.getElementById("empty-schedule-state");
  const scheduleContentContainer = document.getElementById("schedule-content-container");
  const statTotalCourses = document.getElementById("stat-total-courses");
  const statTotalCredits = document.getElementById("stat-total-credits");
  const conflictAlertsContainer = document.getElementById("conflict-alerts-container");
  const prereqAlertsContainer = document.getElementById("prereq-alerts-container");
  const timetableBody = document.getElementById("timetable-body");
  const detailTableBody = document.getElementById("schedule-courses-detail-body");
  const btnPrintSchedule = document.getElementById("btn-print-schedule");

  // Danh mục phòng học mặc định theo mã môn
  const COURSE_LOCATIONS = {
    IT001: "Phòng máy A1-201",
    IT002: "Phòng máy A1-203",
    IT003: "Giảng đường C-102",
    IT004: "Phòng máy B2-304",
    IT005: "Phòng Lab Cisco",
    IT006: "Giảng đường C-201",
    IT007: "Phòng máy A1-305",
    IT008: "Giảng đường B-202",
    IT009: "Phòng Lab Di động B1-105",
    IT010: "Phòng AI & Data Lab",
    IT011: "Phòng CyberSecurity Lab",
    IT012: "Giảng đường C-303"
  };

  // Khung giờ các tiết học chuẩn
  const PERIOD_TIMES = [
    { period: 1, time: "07:00 - 07:50", session: "Sáng" },
    { period: 2, time: "07:55 - 08:45", session: "Sáng" },
    { period: 3, time: "08:50 - 09:40", session: "Sáng" },
    { period: 4, time: "09:45 - 10:35", session: "Sáng" },
    { period: 5, time: "10:40 - 11:30", session: "Sáng" },
    { period: 6, time: "12:30 - 13:20", session: "Chiều" },
    { period: 7, time: "13:25 - 14:15", session: "Chiều" },
    { period: 8, time: "14:20 - 15:10", session: "Chiều" },
    { period: 9, time: "15:15 - 16:05", session: "Chiều" },
    { period: 10, time: "16:10 - 17:00", session: "Chiều" }
  ];

  // Thứ 2 -> Thứ 7 (Map chuỗi text sang index 2..7)
  const DAY_MAP = {
    "thứ 2": 2,
    "thứ hai": 2,
    "thứ 3": 3,
    "thứ ba": 3,
    "thứ 4": 4,
    "thứ tư": 4,
    "thứ 5": 5,
    "thứ năm": 5,
    "thứ 6": 6,
    "thứ sáu": 6,
    "thứ 7": 7,
    "thứ bảy": 7
  };

  // ------------------------------------------------------------------------
  // 2. PHÂN TÍCH LỊCH HỌC VÀ KIỂM TRA XUNG ĐỘT
  // ------------------------------------------------------------------------
  /**
   * Phân tích chuỗi schedule thành Thứ, Tiết bắt đầu và Tiết kết thúc
   * @param {string} scheduleStr 
   */
  function parseSchedule(scheduleStr) {
    if (!scheduleStr) return null;
    const regex = /(Thứ\s*\d+|Thứ\s*[A-Za-zÀ-ỹ]+)\s*\(Tiết\s*(\d+)\s*-\s*(\d+)\)/i;
    const match = scheduleStr.match(regex);
    if (!match) return null;

    const dayText = match[1].trim().toLowerCase();
    const dayNumber = DAY_MAP[dayText] || 2;
    const startPeriod = parseInt(match[2], 10);
    const endPeriod = parseInt(match[3], 10);

    return {
      dayText: match[1].trim(),
      dayNumber,
      startPeriod,
      endPeriod
    };
  }

  /**
   * Tìm tất cả các cặp môn bị trùng lịch học
   * @param {Array} courses 
   * @returns {Array<{courseA: Object, courseB: Object, dayText: string, overlapPeriods: string}>}
   */
  function detectConflicts(courses) {
    const conflicts = [];
    const parsedCourses = courses.map(c => ({
      ...c,
      parsed: parseSchedule(c.schedule)
    })).filter(c => c.parsed !== null);

    for (let i = 0; i < parsedCourses.length; i++) {
      for (let j = i + 1; j < parsedCourses.length; j++) {
        const a = parsedCourses[i];
        const b = parsedCourses[j];

        if (a.parsed.dayNumber === b.parsed.dayNumber) {
          // Kiểm tra xem khoảng tiết có giao nhau không
          const overlap = !(a.parsed.endPeriod < b.parsed.startPeriod || a.parsed.startPeriod > b.parsed.endPeriod);
          if (overlap) {
            const startOverlap = Math.max(a.parsed.startPeriod, b.parsed.startPeriod);
            const endOverlap = Math.min(a.parsed.endPeriod, b.parsed.endPeriod);
            conflicts.push({
              courseA: a,
              courseB: b,
              dayText: a.parsed.dayText,
              overlapPeriods: `Tiết ${startOverlap}-${endOverlap}`
            });
          }
        }
      }
    }
    return conflicts;
  }

  /**
   * Tìm các môn yêu cầu tiên quyết nhưng chưa chọn trong giỏ
   * @param {Array} courses 
   * @returns {Array<{course: Object, missingPrereq: string}>}
   */
  function detectMissingPrerequisites(courses) {
    const selectedIds = new Set(courses.map(c => c.id.toUpperCase()));
    const missing = [];

    courses.forEach(course => {
      if (course.prereq && course.prereq.trim() !== "") {
        const req = course.prereq.trim().toUpperCase();
        if (!selectedIds.has(req)) {
          missing.push({
            course,
            missingPrereq: course.prereq.trim()
          });
        }
      }
    });

    return missing;
  }

  // ------------------------------------------------------------------------
  // 3. HIỂN THỊ CẢNH BÁO
  // ------------------------------------------------------------------------
  function renderAlerts(conflicts, missingPrereqs) {
    // 1. Cảnh báo xung đột lịch
    if (conflictAlertsContainer) {
      if (conflicts.length > 0) {
        conflictAlertsContainer.classList.remove("is-hidden");
        const listItems = conflicts.map(cf => `
          <li>
            <strong>${cf.courseA.name} (${cf.courseA.id})</strong> và <strong>${cf.courseB.name} (${cf.courseB.id})</strong>
            cùng học vào <em>${cf.dayText} (${cf.overlapPeriods})</em>.
          </li>
        `).join("");

        conflictAlertsContainer.innerHTML = `
          <div class="alert-banner alert-danger-banner">
            <span class="alert-banner-icon">⚠️</span>
            <div class="alert-banner-content">
              <div class="alert-banner-title">Phát hiện ${conflicts.length} trường hợp xung đột trùng ca học!</div>
              <div class="alert-banner-desc">
                Bạn không thể tham dự 2 lớp học cùng một lúc. Vui lòng quay lại trang đăng ký để chọn lớp khác:
                <ul>${listItems}</ul>
              </div>
            </div>
          </div>
        `;
      } else {
        conflictAlertsContainer.classList.add("is-hidden");
        conflictAlertsContainer.innerHTML = "";
      }
    }

    // 2. Cảnh báo môn tiên quyết
    if (prereqAlertsContainer) {
      if (missingPrereqs.length > 0) {
        prereqAlertsContainer.classList.remove("is-hidden");
        const prereqItems = missingPrereqs.map(item => `
          <li>
            Môn <strong>${item.course.name} (${item.course.id})</strong> yêu cầu môn tiên quyết:
            <strong style="color: #b45309;">${item.missingPrereq}</strong> (chưa có trong danh sách đăng ký).
          </li>
        `).join("");

        prereqAlertsContainer.innerHTML = `
          <div class="alert-banner alert-warning-banner">
            <span class="alert-banner-icon">💡</span>
            <div class="alert-banner-content">
              <div class="alert-banner-title">Cảnh báo môn học tiên quyết (${missingPrereqs.length} môn)</div>
              <div class="alert-banner-desc">
                Theo quy chế học vụ, sinh viên cần đăng ký hoặc tích lũy môn tiên quyết trước:
                <ul>${prereqItems}</ul>
              </div>
            </div>
            <a href="../index.html" class="btn btn-sm btn-primary" style="align-self: flex-start; margin-top: 4px;">
              Đăng ký bổ sung
            </a>
          </div>
        `;
      } else {
        prereqAlertsContainer.classList.add("is-hidden");
        prereqAlertsContainer.innerHTML = "";
      }
    }
  }

  // ------------------------------------------------------------------------
  // 4. KẾT XUẤT MA TRẬN THỜI KHÓA BIỂU (#timetable-body)
  // ------------------------------------------------------------------------
  function renderTimetableGrid(courses, conflicts) {
    if (!timetableBody) return;

    // Tập hợp ID các môn bị trùng lịch để tô đỏ
    const conflictCourseIds = new Set();
    conflicts.forEach(cf => {
      conflictCourseIds.add(cf.courseA.id);
      conflictCourseIds.add(cf.courseB.id);
    });

    // Chuẩn bị ma trận phân bổ các môn
    // parsed: { course, parsedSchedule }
    const parsedList = courses.map(c => ({
      ...c,
      location: COURSE_LOCATIONS[c.id] || "Giảng đường CNTT",
      parsed: parseSchedule(c.schedule)
    })).filter(c => c.parsed !== null);

    // Bảng theo dõi các cell đã bị rowspan gộp: skipCells["day_period"] = true
    const skipCells = {};
    let html = "";

    // Duyệt qua 10 tiết học
    PERIOD_TIMES.forEach(periodObj => {
      const p = periodObj.period;
      html += `<tr>`;

      // Cột 1: Thông tin tiết học và khung giờ
      html += `
        <td class="period-label-cell">
          <strong>Tiết ${p}</strong><br>
          <span style="font-size: 0.625rem; color: var(--color-text-light);">${periodObj.time}</span>
        </td>
      `;

      // Duyệt qua các cột từ Thứ 2 (day 2) đến Thứ 7 (day 7)
      for (let day = 2; day <= 7; day++) {
        const cellKey = `${day}_${p}`;

        // Nếu ô này đã bị gộp bởi rowspan của tiết phía trước thì bỏ qua
        if (skipCells[cellKey]) {
          continue;
        }

        // Tìm các môn học BẮT ĐẦU từ tiết p vào ngày day
        const startingCourses = parsedList.filter(
          item => item.parsed.dayNumber === day && item.parsed.startPeriod === p
        );

        if (startingCourses.length > 0) {
          // Tính rowspan lớn nhất trong số các môn bắt đầu tại đây
          const maxSpan = Math.max(...startingCourses.map(item => item.parsed.endPeriod - item.parsed.startPeriod + 1));

          // Đánh dấu các tiết tiếp theo cần skip trong cùng cột
          for (let sp = p + 1; sp < p + maxSpan; sp++) {
            skipCells[`${day}_${sp}`] = true;
          }

          // Dựng nội dung các chip môn học trong ô
          const chipsHtml = startingCourses.map(item => {
            const isConflict = conflictCourseIds.has(item.id);
            return `
              <div class="timetable-course-chip ${isConflict ? 'is-conflict' : ''}" title="${item.name}">
                <span class="chip-code">${item.id}</span>
                <span class="chip-name">${item.name}</span>
                <div class="chip-meta">
                  <span>📍 ${item.location}</span>
                </div>
                ${isConflict ? '<span class="conflict-tag-badge">⚠️ Trùng lịch</span>' : ''}
              </div>
            `;
          }).join("");

          html += `
            <td rowspan="${maxSpan}" style="padding: 4px;">
              ${chipsHtml}
            </td>
          `;
        } else {
          // Ô trống không có môn học bắt đầu
          html += `<td></td>`;
        }
      }

      html += `</tr>`;
    });

    timetableBody.innerHTML = html;
  }

  // ------------------------------------------------------------------------
  // 5. BẢNG KÊ CHI TIẾT CÁC HỌC PHẦN TRONG TKB
  // ------------------------------------------------------------------------
  function renderDetailTable(courses, conflicts, missingPrereqs) {
    if (!detailTableBody) return;

    const conflictIds = new Set();
    conflicts.forEach(cf => {
      conflictIds.add(cf.courseA.id);
      conflictIds.add(cf.courseB.id);
    });

    const missingPrereqCourseIds = new Set(missingPrereqs.map(item => item.course.id));

    detailTableBody.innerHTML = courses.map(course => {
      const isConflict = conflictIds.has(course.id);
      const isMissingPrereq = missingPrereqCourseIds.has(course.id);
      const location = COURSE_LOCATIONS[course.id] || "Giảng đường CNTT";

      let statusBadge = `<span class="badge" style="background:#ecfdf5; color:#047857; font-weight:600; padding:4px 8px; border-radius:6px; font-size:0.75rem;">Hợp lệ</span>`;
      if (isConflict) {
        statusBadge = `<span class="badge" style="background:#fef2f2; color:#dc2626; font-weight:600; padding:4px 8px; border-radius:6px; font-size:0.75rem;">⚠️ Trùng lịch</span>`;
      } else if (isMissingPrereq) {
        statusBadge = `<span class="badge" style="background:#fffbeb; color:#b45309; font-weight:600; padding:4px 8px; border-radius:6px; font-size:0.75rem;">Thiếu tiên quyết</span>`;
      }

      return `
        <tr>
          <td><span class="course-code-badge">${course.id}</span></td>
          <td><strong>${course.name}</strong></td>
          <td style="text-align: center;"><span class="badge-credit">${course.credits} TC</span></td>
          <td>${course.prereq ? `<strong style="color: #d97706;">${course.prereq}</strong>` : '<span style="color: var(--color-text-light);">Không</span>'}</td>
          <td>${course.schedule || 'Chưa xếp'}</td>
          <td><span style="font-size: 0.8125rem; color: var(--color-text-muted);">📍 ${location}</span></td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join("");
  }

  // ------------------------------------------------------------------------
  // 6. KHỞI CHẠY VÀ KẾT NỐI LOCAL STORAGE
  // ------------------------------------------------------------------------
  function initSchedulePage() {
    const courses = typeof getCoursesFromStorage === "function" ? getCoursesFromStorage() : [];

    if (!courses || courses.length === 0) {
      if (emptyScheduleState) emptyScheduleState.classList.remove("is-hidden");
      if (scheduleContentContainer) scheduleContentContainer.classList.add("is-hidden");
      return;
    }

    if (emptyScheduleState) emptyScheduleState.classList.add("is-hidden");
    if (scheduleContentContainer) scheduleContentContainer.classList.remove("is-hidden");

    // Thống kê tổng quan
    const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    if (statTotalCourses) statTotalCourses.textContent = courses.length;
    if (statTotalCredits) statTotalCredits.textContent = totalCredits;

    // Phát hiện xung đột và tiên quyết
    const conflicts = detectConflicts(courses);
    const missingPrereqs = detectMissingPrerequisites(courses);

    // Kết xuất giao diện
    renderAlerts(conflicts, missingPrereqs);
    renderTimetableGrid(courses, conflicts);
    renderDetailTable(courses, conflicts, missingPrereqs);
  }

  // Nút in thời khóa biểu
  if (btnPrintSchedule) {
    btnPrintSchedule.addEventListener("click", () => {
      window.print();
    });
  }

  initSchedulePage();
});
