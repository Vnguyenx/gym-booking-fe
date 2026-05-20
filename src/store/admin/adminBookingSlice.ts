// src/store/adminBookingSlice.ts
//
// Quản lý state danh sách booking cho trang Admin.
// Pattern giống adminUserSlice: fetch 1 lần, cache trong Redux.
//
// Các action có thể dùng:
//   - fetchAdminBookings(status?)  — tải danh sách, có thể lọc theo status
//   - changeBookingStatus(...)     — duyệt hoặc huỷ 1 booking

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking, BookingStatus }        from '../../types/models';
import * as adminService                 from '../../services/adminService';

// ── Filter type ───────────────────────────────────────────────────────────────

export type BookingStatusFilter = 'all' | BookingStatus;

// ── State shape ───────────────────────────────────────────────────────────────

interface AdminBookingState {
    bookings:     Booking[];          // danh sách booking đang hiển thị
    loading:      boolean;            // đang fetch lần đầu
    error:        string | null;      // lỗi fetch
    filterStatus: BookingStatusFilter;// bộ lọc đang chọn
    updating:     string | null;      // bookingId đang được cập nhật (tránh click 2 lần)
}

const initialState: AdminBookingState = {
    bookings:     [],
    loading:      false,
    error:        null,
    filterStatus: 'all',
    updating:     null,
};

// ── Async thunks ──────────────────────────────────────────────────────────────

/**
 * Tải danh sách booking.
 * Nếu filter là 'all' thì không truyền status → lấy tất cả.
 */
export const fetchAdminBookings = createAsyncThunk(
    'adminBooking/fetchAll',
    async (status: BookingStatusFilter, { rejectWithValue }) => {
        try {
            const statusParam = status === 'all' ? undefined : status;
            const data = await adminService.fetchBookings(statusParam);
            return data.bookings;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/**
 * Cập nhật status của 1 booking (confirmed | cancelled).
 * Sau khi thành công → cập nhật luôn trong store, không cần fetch lại.
 */
export const changeBookingStatus = createAsyncThunk(
    'adminBooking/changeStatus',
    async (
        { bookingId, status }: { bookingId: string; status: 'confirmed' | 'cancelled' },
        { rejectWithValue }
    ) => {
        try {
            await adminService.updateBookingStatus(bookingId, status);
            // Trả về để reducer cập nhật store
            return { bookingId, status };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const adminBookingSlice = createSlice({
    name: 'adminBooking',
    initialState,
    reducers: {
        // Đổi bộ lọc hiển thị (chỉ lọc phía FE, không fetch lại)
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchAdminBookings ────────────────────────────────────────
            .addCase(fetchAdminBookings.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchAdminBookings.fulfilled, (state, action) => {
                state.loading  = false;
                state.bookings = action.payload;
            })
            .addCase(fetchAdminBookings.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            })

            // ── changeBookingStatus ───────────────────────────────────────
            .addCase(changeBookingStatus.pending, (state, action) => {
                // Lưu lại ID đang xử lý để disable nút bấm
                state.updating = action.meta.arg.bookingId;
            })
            .addCase(changeBookingStatus.fulfilled, (state, action) => {
                state.updating = null;
                // Cập nhật status trực tiếp trong store — không cần fetch lại
                const booking = state.bookings.find(b => b.id === action.payload.bookingId);
                if (booking) booking.status = action.payload.status;
            })
            .addCase(changeBookingStatus.rejected, (state) => {
                state.updating = null;
            });
    },
});

export const { setFilterStatus } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;