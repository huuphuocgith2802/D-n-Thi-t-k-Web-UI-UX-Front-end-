/**
 * ==========================================================================
 * SMART ENROLLMENT - LOCAL STORAGE MODULE (js/storage.js)
 * Cổng Đăng ký Môn học Thông minh - Đồ án môn Thiết kế Web
 * Thành viên phụ trách: Nguyễn Tấn Điền (nhánh feature/Dien)
 * ==========================================================================
 */

/**
 * Khóa lưu trữ cố định trong localStorage theo yêu cầu đồ án
 */
const STORAGE_KEY = "smart_enrollment_cart";

/**
 * Đọc và parse dữ liệu an toàn danh sách môn học đã chọn từ localStorage.
 * Trả về mảng các đối tượng môn học chuẩn hóa.
 * Định dạng mỗi phần tử: { id, name, credits (Number), prereq, schedule, fee (Number) }
 * 
 * @returns {Array<{id: string, name: string, credits: number, prereq: string, schedule: string, fee: number}>}
 */
function getCoursesFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      console.warn("[storage.js] Dữ liệu trong localStorage không đúng định dạng mảng. Khởi tạo mảng rỗng.");
      return [];
    }

    // Chuẩn hóa từng phần tử đảm bảo kiểu dữ liệu Number và String thống nhất
    return parsedData
      .map(item => ({
        id: String(item.id || "").trim(),
        name: String(item.name || "").trim(),
        credits: Number(item.credits) || 0,
        prereq: String(item.prereq || "").trim(),
        schedule: String(item.schedule || "").trim(),
        fee: Number(item.fee) || 0
      }))
      .filter(item => item.id.length > 0);
  } catch (error) {
    console.error("[storage.js] Lỗi đọc localStorage:", error);
    return [];
  }
}

/**
 * Lưu danh sách môn học vào localStorage.
 * Chuẩn hóa kiểu dữ liệu trước khi ghi: credits và fee luôn là Number.
 * 
 * @param {Array<{id: string, name: string, credits: number, prereq: string, schedule: string, fee: number}>} courses
 * @returns {boolean} Kết quả lưu thành công hay thất bại
 */
function saveCoursesToStorage(courses) {
  try {
    if (!Array.isArray(courses)) {
      console.error("[storage.js] Lỗi: Dữ liệu truyền vào saveCoursesToStorage phải là Array.");
      return false;
    }

    const sanitizedCourses = courses.map(item => ({
      id: String(item.id || "").trim(),
      name: String(item.name || "").trim(),
      credits: Number(item.credits) || 0,
      prereq: String(item.prereq || "").trim(),
      schedule: String(item.schedule || "").trim(),
      fee: Number(item.fee) || 0
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedCourses));
    return true;
  } catch (error) {
    console.error("[storage.js] Lỗi ghi localStorage:", error);
    return false;
  }
}

/**
 * Xóa sạch toàn bộ dữ liệu giỏ môn học trong localStorage.
 * 
 * @returns {boolean} Kết quả xóa thành công hay thất bại
 */
function clearCoursesStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("[storage.js] Lỗi xóa localStorage:", error);
    return false;
  }
}

/**
 * Kiểm tra xem mã môn học đã có trong giỏ hàng hay chưa.
 * 
 * @param {string} courseId Mã môn cần kiểm tra (ví dụ: "IT001")
 * @returns {boolean}
 */
function isCourseInStorage(courseId) {
  if (!courseId) return false;
  const currentCourses = getCoursesFromStorage();
  return currentCourses.some(course => course.id.toUpperCase() === String(courseId).trim().toUpperCase());
}

// Gắn vào đối tượng window toàn cục để các script khác và trang phụ (schedule, checkout) dễ dàng sử dụng
if (typeof window !== "undefined") {
  window.STORAGE_KEY = STORAGE_KEY;
  window.getCoursesFromStorage = getCoursesFromStorage;
  window.saveCoursesToStorage = saveCoursesToStorage;
  window.clearCoursesStorage = clearCoursesStorage;
  window.isCourseInStorage = isCourseInStorage;
}
