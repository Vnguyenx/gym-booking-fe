// src/services/adminService.ts
//
// Tất cả API call liên quan đến admin.
// Không chứa logic Redux — chỉ fetch và trả data thô.
//
// Base URL đọc từ biến môi trường REACT_APP_API_URL.
// Cookie session được gửi tự động nhờ credentials: 'include'.

import type {
    UserProfile,
    PT,
    PTApplication,
    PTService,
    ClassItem,
    Booking,
    BookingStatus,
    Membership,
    Equipment,
    GymInfo,
    Banner,
    PTInfo,
    Zone,
} from '../types/models';

// ── Revenue types (chưa có trong models.ts) ───────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Wrapper fetch chung: tự đính kèm cookie, throw lỗi nếu response không OK.
 * Mọi hàm bên dưới dùng hàm này thay vì gọi fetch trực tiếp.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? res.statusText);
    }

    return res.json() as Promise<T>;
}

// ══════════════════════════════════════════════════════
//  USERS
// ══════════════════════════════════════════════════════

/** Lấy danh sách user, lọc theo role nếu có */
export const fetchUsers = (role?: 'customer' | 'pt') => {
    const query = role ? `?role=${role}` : '';
    return apiFetch<{ users: UserProfile[] }>(`/api/admin/users${query}`);
};

/** Lấy chi tiết 1 user */
export const fetchUserById = (uid: string) =>
    apiFetch<{ user: UserProfile }>(`/api/admin/users/${uid}`);

/** Cập nhật thông tin user (displayName, phone, role, avatarUrl) */
export const updateUser = (uid: string, data: Partial<Pick<UserProfile, 'displayName' | 'phone' | 'role' | 'avatarUrl'>>) =>
    apiFetch<{ message: string }>(`/api/admin/users/${uid}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá user */
export const deleteUser = (uid: string) =>
    apiFetch<{ message: string }>(`/api/admin/users/${uid}`, {
        method: 'DELETE',
    });

// ══════════════════════════════════════════════════════
//  PTs
// ══════════════════════════════════════════════════════

/** Lấy danh sách hồ sơ PT */
export const fetchPTs = () =>
    apiFetch<{ pts: PT[] }>('/api/admin/pts');

/** Lấy chi tiết 1 PT */
export const fetchPTById = (ptId: string) =>
    apiFetch<{ pt: PT }>(`/api/admin/pts/${ptId}`);

/** Cập nhật hồ sơ PT */
export const updatePT = (ptId: string, data: Partial<Omit<PT, 'id' | 'updateAt'>>) =>
    apiFetch<{ message: string }>(`/api/admin/pts/${ptId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

// ══════════════════════════════════════════════════════
//  PT APPLICATIONS
// ══════════════════════════════════════════════════════

/** Lấy danh sách đơn đăng ký làm PT */
export const fetchPTApplications = (status?: PTApplication['status']) => {
    const query = status ? `?status=${status}` : '';
    return apiFetch<{ applications: PTApplication[] }>(`/api/admin/pt-applications${query}`);
};

/** Duyệt hoặc từ chối đơn đăng ký PT */
export const reviewPTApplication = (id: string, status: 'approved' | 'rejected') =>
    apiFetch<{ message: string }>(`/api/admin/pt-applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });

// ══════════════════════════════════════════════════════
//  CLASSES
// ══════════════════════════════════════════════════════

/** Lấy danh sách lớp học, hỗ trợ filter */
export const fetchClasses = (filters?: { status?: string; ptId?: string; customerId?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const query = params ? `?${params}` : '';
    return apiFetch<{ classes: ClassItem[] }>(`/api/admin/classes${query}`);
};

/** Lấy chi tiết 1 lớp kèm attendance */
export const fetchClassById = (classId: string) =>
    apiFetch<{ class: ClassItem }>(`/api/admin/classes/${classId}`);

/** Tạo lớp học mới */
export const createClass = (data: Partial<Omit<ClassItem, 'id' | 'attendance'>>) =>
    apiFetch<{ message: string; classId: string }>('/api/admin/classes', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/** Cập nhật lớp học (status, ptId, endDate, totalSessions...) */
export const updateClass = (classId: string, data: Partial<Pick<ClassItem, 'status' | 'ptId' | 'endDate' | 'totalSessions' | 'usedSessions'>>) =>
    apiFetch<{ message: string }>(`/api/admin/classes/${classId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá lớp học */
export const deleteClass = (classId: string) =>
    apiFetch<{ message: string }>(`/api/admin/classes/${classId}`, {
        method: 'DELETE',
    });

// ══════════════════════════════════════════════════════
//  BOOKINGS
// ══════════════════════════════════════════════════════

/** Lấy danh sách booking, lọc theo status nếu có */
export const fetchBookings = (status?: BookingStatus) => {
    const query = status ? `?status=${status}` : '';
    return apiFetch<{ bookings: Booking[] }>(`/api/admin/bookings${query}`);
};

/** Lấy chi tiết 1 booking */
export const fetchBookingById = (bookingId: string) =>
    apiFetch<{ booking: Booking }>(`/api/admin/bookings/${bookingId}`);

/** Xác nhận hoặc huỷ booking */
export const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled') =>
    apiFetch<{ message: string }>(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });

// ══════════════════════════════════════════════════════
//  MEMBERSHIPS
// ══════════════════════════════════════════════════════

/** Lấy danh sách gói tập */
export const fetchMemberships = () =>
    apiFetch<{ memberships: Membership[] }>('/api/admin/memberships');

/** Tạo gói tập mới */
export const createMembership = (data: Omit<Membership, 'id'>) =>
    apiFetch<{ message: string; membershipId: string }>('/api/admin/memberships', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/** Cập nhật gói tập */
export const updateMembership = (id: string, data: Partial<Omit<Membership, 'id'>>) =>
    apiFetch<{ message: string }>(`/api/admin/memberships/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá gói tập */
export const deleteMembership = (id: string) =>
    apiFetch<{ message: string }>(`/api/admin/memberships/${id}`, {
        method: 'DELETE',
    });

// ══════════════════════════════════════════════════════
//  PT SERVICES
// ══════════════════════════════════════════════════════

/** Lấy danh sách dịch vụ PT */
export const fetchPTServices = () =>
    apiFetch<{ ptServices: PTService[] }>('/api/admin/pt-services');

/** Cập nhật dịch vụ PT */
export const updatePTService = (id: string, data: Partial<Omit<PTService, 'id'>>) =>
    apiFetch<{ message: string }>(`/api/admin/pt-services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

// ══════════════════════════════════════════════════════
//  EQUIPMENT
// ══════════════════════════════════════════════════════

/** Lấy danh sách thiết bị, lọc theo zone hoặc floor nếu có */
export const fetchEquipment = (filters?: { zoneId?: string; floorId?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const query = params ? `?${params}` : '';
    return apiFetch<{ equipment: Equipment[] }>(`/api/admin/equipment${query}`);
};

/** Tạo thiết bị mới */
export const createEquipment = (data: Omit<Equipment, 'id' | 'updatedAt'>) =>
    apiFetch<{ message: string; equipmentId: string }>('/api/admin/equipment', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/** Cập nhật thiết bị */
export const updateEquipment = (id: string, data: Partial<Omit<Equipment, 'id' | 'updatedAt'>>) =>
    apiFetch<{ message: string }>(`/api/admin/equipment/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá thiết bị */
export const deleteEquipment = (id: string) =>
    apiFetch<{ message: string }>(`/api/admin/equipment/${id}`, {
        method: 'DELETE',
    });

// ══════════════════════════════════════════════════════
//  CONTENT — gym info, settings, banners, pt info, zones
// ══════════════════════════════════════════════════════

/** Lấy thông tin phòng gym */
export const fetchGymInfo = () =>
    apiFetch<{ gymInfo: GymInfo }>('/api/admin/gym-info');

/** Cập nhật thông tin phòng gym */
export const updateGymInfo = (data: Partial<Omit<GymInfo, 'id'>>) =>
    apiFetch<{ message: string }>('/api/admin/gym-info', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

/** Lấy cài đặt gym (docId: 'daily_config' | 'payment') */
export const fetchGymSetting = (docId: 'daily_config' | 'payment') =>
    apiFetch<{ setting: Record<string, any> }>(`/api/admin/gym-settings/${docId}`);

/** Cập nhật cài đặt gym */
export const updateGymSetting = (docId: 'daily_config' | 'payment', data: Record<string, any>) =>
    apiFetch<{ message: string }>(`/api/admin/gym-settings/${docId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Lấy danh sách banner */
export const fetchBanners = () =>
    apiFetch<{ banners: Banner[] }>('/api/admin/banners');

/** Tạo banner mới */
export const createBanner = (data: Omit<Banner, 'id'>) =>
    apiFetch<{ message: string; bannerId: string }>('/api/admin/banners', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/** Cập nhật banner */
export const updateBanner = (bannerId: string, data: Partial<Omit<Banner, 'id'>>) =>
    apiFetch<{ message: string }>(`/api/admin/banners/${bannerId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá banner */
export const deleteBanner = (bannerId: string) =>
    apiFetch<{ message: string }>(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
    });

/** Lấy thông tin PT info */
export const fetchPtInfo = () =>
    apiFetch<{ ptInfo: PTInfo }>('/api/admin/pt-info');

/** Cập nhật PT info */
export const updatePtInfo = (data: Partial<Omit<PTInfo, 'id' | 'updateAt'>>) =>
    apiFetch<{ message: string }>('/api/admin/pt-info', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

/** Lấy danh sách zone */
export const fetchZones = () =>
    apiFetch<{ zones: Zone[] }>('/api/admin/zones');

/** Tạo zone mới */
export const createZone = (data: Omit<Zone, 'id'>) =>
    apiFetch<{ message: string; zoneId: string }>('/api/admin/zones', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/** Cập nhật zone */
export const updateZone = (zoneId: string, data: Partial<Omit<Zone, 'id'>>) =>
    apiFetch<{ message: string }>(`/api/admin/zones/${zoneId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/** Xoá zone */
export const deleteZone = (zoneId: string) =>
    apiFetch<{ message: string }>(`/api/admin/zones/${zoneId}`, {
        method: 'DELETE',
    });

// ══════════════════════════════════════════════════════
//  REVENUE
// ══════════════════════════════════════════════════════

/** Doanh thu theo tháng cụ thể */
export const fetchRevenue = (month: number, year: number) =>
    apiFetch<RevenueByMonth>(`/api/admin/revenue?month=${month}&year=${year}`);

/** Tổng quan doanh thu 6 tháng gần nhất */
export const fetchRevenueSummary = () =>
    apiFetch<RevenueSummary>('/api/admin/revenue/summary');