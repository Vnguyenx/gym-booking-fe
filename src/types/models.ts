// src/types/models.ts
import { Role } from '../constants/roles';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Banner {
    id?: string;
    imageUrl: string;
    isActive: boolean;
    link: string;
    order: number;
    subtitle: string;
    title: string;
}

// ── PT ────────────────────────────────────────────────────────────────────────

// Object bên trong mảng Benefits của PTInfo
export interface Benefit {
    title: string;
    content: string;
}

// Collection: pt_info
export interface PTInfo {
    id?: string;
    Benefits: Benefit[];
    description: string;
    img: string;
    updateAt: Date;
}

// Collection: pts
export interface PT {
    id?: string;
    avatar: string;
    bio: string;
    experience: string;
    fullName: string;
    gender: 'Nam' | 'Nữ' | string;
    isAvailable: boolean;
    specialty: string[];
    updateAt: Date;
}

export interface PTApplication {
    id?: string;
    avatarUrl: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    specialty: string[];
    experience: string;
    bio: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

// Collection: pt_services
export interface PTService {
    id?: string;
    name: string;              // "Thuê PT kèm riêng 1:1"
    pricePerMonth: number;     // 1500000
    type?: string;
}

// ── User ──────────────────────────────────────────────────────────────────────

// Mở rộng từ User trong authSlice
export interface UserProfile {
    id?: string;
    uid: string;
    email: string;
    displayName: string;
    role: Role;
    phone: string;
    avatarUrl: string;
    createdAt: Date;
}
export type ProfileFormData = Pick<UserProfile, 'displayName' | 'phone' | 'email'>;

export interface UseProfileReturn {
    formData: ProfileFormData;
    isEditing: boolean;
    isSaving: boolean;
    successMessage: string;
    errorMessage: string;
    avatarUrl: string;
    isUploadingAvatar: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
    handleChange: (field: keyof ProfileFormData, value: string) => void;
    handleSave: () => Promise<void>;
    handleAvatarSave: (url: string) => Promise<void>;
}

// ── Gym ───────────────────────────────────────────────────────────────────────

export interface Location {
    latitude: number;
    longitude: number;
    mapUrl: string;
}

export interface Amenities {
    locker: boolean;
    parking: boolean;
    parkingNote: string;
    shower: boolean;
    toilet: boolean;
    toiletNote: string;
    waterFilter: number;
    waterFilterNote: string;
    wifi: boolean;
    wifiNote: string;
}

export interface GymInfo {
    id?: string;
    name: string;
    description: string;
    address: string;
    location: Location;
    phone: string;
    openTime: string;
    totalFloors: number;
    coverImageUrl: string;
    amenities: Amenities;
}

export interface Floor {
    id?: string;
    name: string;
    floorNumber: number;
    description: string;
    gymId: string;
    area: number;
    img: string;
}

export interface Zone {
    id?: string;
    name: string;
    description: string;
    floorId: string;
    gymId: string;
}

export interface Equipment {
    id?: string;
    name: string;
    nameVi: string;
    description: string;
    category: string;
    subCategory: string;
    floorId: string;
    gymId: string;
    zoneId: string;
    imageUrls: string[];
    isActive: boolean;
    quantity: number;
    muscleGroups: string[];
    tips: string;
    updatedAt: Date;
}

// ── Membership & Booking ──────────────────────────────────────────────────────

export interface Membership {
    id?: string;
    name: string;
    durationMonths: number;
    price: number;
    priceOnline: number;
    note: string;
    isPopular?: boolean;
    promotions: string[];
}

/**
 * GymBooking — Collection: bookings
 * Đặt gói tập / mua dịch vụ PT (khác với lịch hẹn trong useBookingHistory)
 * Đổi tên từ Booking → GymBooking để tránh conflict với BookingHistory.Booking
 */
// ── Booking History ───────────────────────────────────────────────────────────

// Khớp đúng với schema Firestore collection: bookings
export interface Booking {
    id: string;
    customerId: string;
    membershipId: string;   // VD: "mem-1m", "mem-3m"
    ptServiceId: string;    // VD: "pt-none", "pt-1on1"
    ptId: string;           // uid PT, rỗng nếu không chọn PT
    totalPrice: number;     // Đơn vị: VND
    status: BookingStatus;
    createdAt: string | null;  // ISO string sau khi BE convert
    paidAt: string | null;     // ISO string sau khi BE convert
    paymentCode?: String;
    vnpay_TransactionNo?: string;
    customerName?: string;
    customerPhone?: string;
    membershipName?: string;
    ptServiceName?: string;
    ptName?: string;
}

export interface UseBookingsReturn {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
    handleCancel: (id: string) => Promise<void>;
}

/// ── Classes & Attendance ──────────────────────────────────────────────────────

export type ClassStatus     = 'active' | 'expired';
export type ClassType =
    | 'none'          // Tự tập
    | 'personal'      // PT 1:1 mặc định
    | 'group'         // Tập nhóm
    | 'pt-1on1-vip'   // Gói VIP mới tạo
    | string;         // Thêm cái này để "mở đường" cho các loại mới từ DB mà FE chưa kịp update

export type AttendanceType  = 'membership_checkin' | 'pt_session' | null;
export type CustomerStatus  = 'confirmed' | null;
export type PTStatus        = 'none' | 'confirmed' | null;

export interface AttendanceRecord {
    id: string;
    date: any;                  // ISO string sau khi BE convert
    isSuccess: boolean | null;
    type: AttendanceType;
    customerStatus: CustomerStatus;
    ptStatus: PTStatus;
    secretCodeUsed: string | null;
}

export interface ClassItem {
    id: string;
    customerId: string;
    customerName?: string;
    customerAvatar: string;
    classGroupId: string | null;
    type: ClassType;
    ptServiceName?: string;
    typeName?: string;
    status: ClassStatus;
    startDate: string;             // ISO string
    endDate: string;               // ISO string
    ptId: string;
    ptName?: string;
    totalSessions: number;
    usedSessions: number;
    createdBy: string;
    creatorRole: string;
    creatorName?: string;
    attendance: AttendanceRecord[];
}

export interface CreateClassRequest {
    customerName: string;
    ptName: string;
    type: string;
    classGroupId: string;
    totalSessions: number;
    startDate: string;
    endDate: string;
}

export interface UseClassesReturn {
    classes: ClassItem[];
    isLoading: boolean;
    error: string | null;
    selectedClassId: string | null;
    selectedClass: ClassItem | undefined;
    selectClass: (id: string) => void;
    clearSelection: () => void;
}

// Kiểu dữ liệu dùng cho hàm Update: Cho phép cập nhật lẻ tẻ từng trường
export type UpdateClassData = {
    status?: 'active' | 'expired';
    ptName?: string;
    endDate?: string;
    totalSessions?: number;
    usedSessions?: number;
    classGroupId?: string | null;
};

// ── PT Dashboard ──────────────────────────────────────────────────────────────
// Types dùng riêng cho luồng PT đã đăng nhập (dashboard, students, notifications)

/**
 * Thống kê tổng hợp hiển thị trên dashboard của PT.
 * Tính toán ở FE từ dữ liệu Redux store, không call API riêng.
 */
export interface PTDashboardStats {
    activeCount: number;        // Số lớp đang active
    active1on1Count: number;    // Số lớp 1:1 active
    activeGroupCount: number;   // Số nhóm active (unique classGroupId)
    sessionsThisMonth: number;  // Tổng buổi điểm danh thành công trong tháng
    pendingConfirmCount: number; // Số buổi chờ PT xác nhận (ptStatus === 'none')
    expiredCount: number;       // Số lớp đã hết hạn
}

/**
 * Một buổi chờ PT xác nhận — dùng ở tab Thông báo.
 * Flatten từ ClassItem + AttendanceRecord để component không cần drill sâu.
 */
export interface PendingConfirmItem {
    attendanceId: string;       // ID của attendance record
    classId: string;            // ID của class chứa attendance này
    customerName: string;       // Tên học viên
    groupName: string | null;   // Tên nhóm nếu pt-group, null nếu 1:1
    classType: ClassType;
    checkinTime: string;        // ISO string
}

/** Filter tab ở màn hình Học viên của PT */
export type StudentFilter = 'all' | '1on1' | 'group' | 'expired';

/**
 * Một nhóm học viên cùng classGroupId — dùng để render group-card.
 * FE tự group từ danh sách classes trả về BE.
 */
export interface GroupedClass {
    groupId: string;            // classGroupId dùng làm key
    groupName: string;          // "Nhóm {groupId}" hoặc tên thực nếu có
    members: ClassItem[];       // Danh sách class trong nhóm
    endDate: string;            // endDate xa nhất trong nhóm
}

/**
 * Dữ liệu form chỉnh sửa hồ sơ PT.
 * Khớp với các field BE cho phép sửa: PUT /api/pt/profile
 */
export interface PTProfileFormData {
    bio: string;
    specialty: string[];
    experience: string;
    isAvailable: boolean;       // true = đang nhận học viên
}

// ── PT Dashboard API Response shapes ─────────────────────────────────────────
// Khớp đúng với response JSON từ ptController.js

export interface GetStudentsResponse {
    classes: ClassItem[];
}

export interface ConfirmAttendanceResponse {
    message: string;
}

export interface UpdatePTProfileResponse {
    message: string;
}

// Cho adminRevenueController
export interface RevenueByMonth {
    month: number;
    year: number;
    totalRevenue: number;
    count: number;
    byDay: Record<number, number>;
    bookings: Booking[];
}

export interface RevenueSummary {
    summary: Record<string, number>; // { "2025-01": 5000000, ... }
}