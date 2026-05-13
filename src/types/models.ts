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
    type: 'personal' | 'group' | 'none';
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
    /** Tên gói tập, ví dụ: "Gói tập 3 tháng" */
    name: string;
    /** Số tháng của gói */
    durationMonths: number;
    /** Giá gốc (đồng) */
    price: number;
    /** Giá khi đăng ký online (đồng) */
    priceOnline: number;
    /** Ghi chú ngắn, ví dụ: "330K/tháng" */
    note: string;
    /** Có phải gói phổ biến nhất không */
    isPopular?: boolean;
    /** Danh sách quyền lợi / tính năng nổi bật */
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
    paymentCode: String;
}

export interface UseBookingsReturn {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
    handleCancel: (id: string) => Promise<void>;
}

/// ── Classes & Attendance ──────────────────────────────────────────────────────

export type ClassStatus     = 'active' | 'expired';
export type ClassType       = 'membership_only' | 'pt_coaching';
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
    type: ClassType;
    status: ClassStatus;
    startDate: string;             // ISO string
    endDate: string;               // ISO string
    ptId: string;
    totalSessions: number;
    usedSessions: number;
    createdBy: string;
    creatorRole: string;
    attendance: AttendanceRecord[];
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