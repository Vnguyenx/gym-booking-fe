// Redux slice quản lý toàn bộ state của luồng PT.
//
// State gồm 3 phần chính:
//   1. students   — danh sách lớp active + expired
//   2. profile    — trạng thái form chỉnh sửa hồ sơ
//   3. confirm    — trạng thái xác nhận từng buổi điểm danh
//
// Quy tắc fetch:
//   - Fetch 1 lần khi PT mở app, lưu vào store
//   - Không fetch lại trừ khi user bấm refresh hoặc sau khi thực hiện action
//   - Dùng isLoaded flag để tránh fetch trùng

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClassItem, PTProfileFormData } from '../types/models';
import * as ptService from '../services/ptService';

// ─── State shape ──────────────────────────────────────────────────────────────

interface PTState {
    // Danh sách lớp học
    activeClasses: ClassItem[];
    expiredClasses: ClassItem[];

    // Trạng thái loading / error riêng cho từng fetch
    studentsLoading: boolean;
    studentsError: string | null;
    /** true sau khi đã fetch thành công lần đầu — tránh fetch lại khi chuyển tab */
    studentsLoaded: boolean;

    // Xác nhận điểm danh — track từng attendanceId đang xử lý
    confirmingIds: string[];   // attendanceId đang gọi API
    confirmError: string | null;

    // Cập nhật hồ sơ PT
    profileSaving: boolean;
    profileError: string | null;
    profileSuccess: boolean;
}

const initialState: PTState = {
    activeClasses:   [],
    expiredClasses:  [],
    studentsLoading: false,
    studentsError:   null,
    studentsLoaded:  false,
    confirmingIds:   [],
    confirmError:    null,
    profileSaving:   false,
    profileError:    null,
    profileSuccess:  false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/**
 * Fetch cả active lẫn expired song song.
 * Dùng Promise.all để giảm thời gian chờ.
 * Gọi trong PtLayout hoặc khi app khởi động.
 */
export const fetchPTStudents = createAsyncThunk(
    'ptDashboard/fetchStudents',
    async (_, { rejectWithValue }) => {
        try {
            const [activeRes, expiredRes] = await Promise.all([
                ptService.fetchActiveStudents(),
                ptService.fetchExpiredStudents(),
            ]);
            return {
                activeClasses:  activeRes.classes,
                expiredClasses: expiredRes.classes,
            };
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Không thể tải danh sách học viên');
        }
    },
);

/**
 * PT xác nhận một buổi điểm danh.
 * Sau khi thành công, cập nhật ptStatus trong store — không fetch lại toàn bộ.
 */
export const confirmAttendance = createAsyncThunk(
    'ptDashboard/confirmAttendance',
    async (
        { attendanceId, classId }: { attendanceId: string; classId: string },
        { rejectWithValue },
    ) => {
        try {
            await ptService.confirmAttendance(attendanceId, classId);
            // Trả về để reducer biết cần update record nào
            return { attendanceId, classId };
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Xác nhận thất bại');
        }
    },
);

/**
 * Cập nhật hồ sơ PT.
 * Không cần reload page — profile trong authSlice sẽ được sync riêng nếu cần.
 */
export const updatePTProfile = createAsyncThunk(
    'ptDashboard/updateProfile',
    async (data: PTProfileFormData, { rejectWithValue }) => {
        try {
            await ptService.updatePTProfile(data);
            return data; // trả lại data để component dùng nếu cần
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Cập nhật thất bại');
        }
    },
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Cập nhật ptStatus của một attendance record trong danh sách classes.
 * Dùng chung cho cả activeClasses và expiredClasses.
 */
function updateAttendanceInList(
    classes: ClassItem[],
    classId: string,
    attendanceId: string,
    ptStatus: 'confirmed',
): ClassItem[] {
    return classes.map((c) => {
        if (c.id !== classId) return c;
        return {
            ...c,
            attendance: c.attendance.map((a) =>
                a.id === attendanceId ? { ...a, ptStatus } : a,
            ),
        };
    });
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const ptSlice = createSlice({
    name: 'ptDashboard',
    initialState,

    reducers: {
        /** Xoá lỗi xác nhận — dùng khi đóng toast/modal lỗi */
        clearConfirmError(state) {
            state.confirmError = null;
        },

        /** Xoá lỗi + success flag của profile form — dùng khi đóng form */
        clearProfileStatus(state) {
            state.profileError   = null;
            state.profileSuccess = false;
        },

        /**
         * Buộc fetch lại lần sau (vd: sau khi admin thêm lớp mới cho PT).
         * Đặt studentsLoaded = false để fetchPTStudents chạy lại.
         */
        invalidateStudents(state) {
            state.studentsLoaded = false;
        },
    },

    extraReducers: (builder) => {
        // ── fetchPTStudents ───────────────────────────────────────────────────────
        builder
            .addCase(fetchPTStudents.pending, (state) => {
                state.studentsLoading = true;
                state.studentsError   = null;
            })
            .addCase(fetchPTStudents.fulfilled, (state, action) => {
                state.studentsLoading = false;
                state.studentsLoaded  = true;
                state.activeClasses   = action.payload.activeClasses;
                state.expiredClasses  = action.payload.expiredClasses;
            })
            .addCase(fetchPTStudents.rejected, (state, action) => {
                state.studentsLoading = false;
                state.studentsError   = action.payload as string;
            });

        // ── confirmAttendance ─────────────────────────────────────────────────────
        builder
            .addCase(confirmAttendance.pending, (state, action) => {
                // Ghi nhận ID đang xử lý để disable nút Xác nhận tương ứng
                state.confirmingIds.push(action.meta.arg.attendanceId);
                state.confirmError = null;
            })
            .addCase(confirmAttendance.fulfilled, (state, action) => {
                const { attendanceId, classId } = action.payload;

                // Xoá khỏi danh sách đang xử lý
                state.confirmingIds = state.confirmingIds.filter((id) => id !== attendanceId);

                // Cập nhật ptStatus trực tiếp trong store — không fetch lại
                state.activeClasses  = updateAttendanceInList(state.activeClasses,  classId, attendanceId, 'confirmed');
                state.expiredClasses = updateAttendanceInList(state.expiredClasses, classId, attendanceId, 'confirmed');
            })
            .addCase(confirmAttendance.rejected, (state, action) => {
                state.confirmingIds = state.confirmingIds.filter(
                    (id) => id !== action.meta.arg.attendanceId,
                );
                state.confirmError = action.payload as string;
            });

        // ── updatePTProfile ───────────────────────────────────────────────────────
        builder
            .addCase(updatePTProfile.pending, (state) => {
                state.profileSaving  = true;
                state.profileError   = null;
                state.profileSuccess = false;
            })
            .addCase(updatePTProfile.fulfilled, (state) => {
                state.profileSaving  = false;
                state.profileSuccess = true;
            })
            .addCase(updatePTProfile.rejected, (state, action) => {
                state.profileSaving = false;
                state.profileError  = action.payload as string;
            });
    },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
    clearConfirmError,
    clearProfileStatus,
    invalidateStudents,
} = ptSlice.actions;

export default ptSlice.reducer;