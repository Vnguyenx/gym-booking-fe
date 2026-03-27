// constants/routes.ts
// Định nghĩa tất cả đường dẫn URL của ứng dụng
// Lý do dùng constant thay vì gõ string trực tiếp:
// nếu cần đổi URL, chỉ sửa 1 chỗ ở đây, không cần tìm khắp project

export const ROUTES = {
    // ── Public routes (không cần đăng nhập) ──
    HOME: '/',                    // Trang chủ
    GYM_INFO: '/gym-info',        // Thông tin phòng gym
    EQUIPMENT: '/equipment',      // Danh sách máy móc
    EXERCISES: '/exercises',      // Danh sách bài tập
    PT_LIST: '/pts',              // Danh sách huấn luyện viên
    PT_DETAIL: '/pts/:id',        // Chi tiết 1 huấn luyện viên

    // ── Auth routes (đăng nhập / đăng ký) ──
    LOGIN: '/login',
    REGISTER: '/register',

    // ── Customer routes (cần đăng nhập, role: customer) ──
    BOOKING: '/booking',          // Đặt lịch tập
    MY_PROFILE: '/profile',       // Trang cá nhân
    MY_BOOKINGS: '/my-bookings',  // Lịch sử đặt lịch
    ATTENDANCE: '/attendance',    // Điểm danh
    CHAT: '/chat',                // Chat với AI

    // ── PT routes (cần đăng nhập, role: pt) ──
    PT_DASHBOARD: '/pt/dashboard',  // Trang quản lý của PT
    PT_REGISTER: '/pt/register',    // Đăng ký làm PT
    PT_STUDENTS: '/pt/students',    // Danh sách học viên

    // ── Admin routes (cần đăng nhập, role: admin) ──
    ADMIN_DASHBOARD: '/admin/dashboard',    // Tổng quan
    ADMIN_BOOKINGS: '/admin/bookings',      // Quản lý đặt lịch
    ADMIN_PTS: '/admin/pts',               // Quản lý PT
    ADMIN_COURSES: '/admin/courses',        // Quản lý khoá học
    ADMIN_COMMENTS: '/admin/comments',      // Kiểm duyệt bình luận
} as const;