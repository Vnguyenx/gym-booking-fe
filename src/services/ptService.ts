// src/services/ptService.ts
// Tất cả API call liên quan đến PT.
// Không chứa logic Redux — chỉ fetch và trả data thô.
//
// Base URL đọc từ biến môi trường REACT_APP_API_URL (Create React App).
// Cookie session được gửi tự động nhờ credentials: 'include'.

import {
    GetStudentsResponse,
    ConfirmAttendanceResponse,
    UpdatePTProfileResponse,
    PTProfileFormData,
} from '../types/models';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Wrapper fetch chung: tự đính kèm cookie, throw lỗi nếu response không OK.
 * Mọi hàm bên dưới dùng hàm này thay vì gọi fetch trực tiếp.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: 'include',           // gửi session cookie
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        // Ưu tiên message từ BE, fallback về status text
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? res.statusText);
    }

    return res.json() as Promise<T>;
}

// ─── Students ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách học viên đang active (status === 'active').
 * GET /api/pt/students
 */
export const fetchActiveStudents = (): Promise<GetStudentsResponse> =>
    apiFetch<GetStudentsResponse>('/api/pt/students');

/**
 * Lấy danh sách học viên đã hết hạn (status === 'expired').
 * GET /api/pt/students/history
 */
export const fetchExpiredStudents = (): Promise<GetStudentsResponse> =>
    apiFetch<GetStudentsResponse>('/api/pt/students/history');

// ─── Attendance ───────────────────────────────────────────────────────────────

/**
 * PT xác nhận một buổi điểm danh.
 * POST /api/pt/confirm/:attendanceId
 *
 * @param attendanceId  ID của attendance record cần xác nhận
 * @param classId       ID của class chứa attendance đó (BE cần để verify quyền)
 */
export const confirmAttendance = (
    attendanceId: string,
    classId: string,
): Promise<ConfirmAttendanceResponse> =>
    apiFetch<ConfirmAttendanceResponse>(`/api/pt/confirm/${attendanceId}`, {
        method: 'POST',
        body: JSON.stringify({ classId }),
    });

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Cập nhật hồ sơ PT.
 * PUT /api/pt/profile
 * Chỉ gửi các field BE cho phép: bio, specialty, experience, isAvailable.
 */
export const updatePTProfile = (
    data: PTProfileFormData,
): Promise<UpdatePTProfileResponse> =>
    apiFetch<UpdatePTProfileResponse>('/api/pt/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });