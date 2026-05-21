// src/store/adminBookingSlice.ts
//
// Quản lý state danh sách booking cho trang Admin.
// Pattern giống adminUserSlice: fetch 1 lần, cache trong Redux.
//
// Các action có thể dùng:
//   - fetchAdminBookings(status?)  — tải danh sách, có thể lọc theo status
//   - changeBookingStatus(...)     — duyệt hoặc huỷ 1 booking
//   - createAdminBooking(...)      — tạo booking walk-in / cash

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking, BookingStatus }        from '../../types/models';
import * as adminService                 from '../../services/adminService';

// ── Filter type ───────────────────────────────────────────────────────────────

export type BookingStatusFilter = 'all' | BookingStatus;

// ── State shape ───────────────────────────────────────────────────────────────

interface AdminBookingState {
    bookings:       Booking[];            // danh sách booking đang hiển thị
    loading:        boolean;              // đang fetch lần đầu
    error:          string | null;        // lỗi fetch
    filterStatus:   BookingStatusFilter;  // bộ lọc đang chọn
    updating:       string | null;        // bookingId đang được cập nhật (tránh click 2 lần)
    selectedDetail: Booking | null;
    loadingDetail:  boolean;
    creating:       boolean;              // đang submit tạo booking mới
    createError:    string | null;        // lỗi tạo booking
}

const initialState: AdminBookingState = {
    bookings:       [],
    loading:        false,
    error:          null,
    filterStatus:   'all',
    updating:       null,
    selectedDetail: null,
    loadingDetail:  false,
    creating:       false,
    createError:    null,
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
            return { bookingId, status };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getBookingDetail = createAsyncThunk(
    'adminBooking/getDetail',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            const data = await adminService.fetchBookingById(bookingId);
            return data.booking;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/**
 * Tạo booking mới (walk-in / cash).
 * BE nhận IDs → trả về booking đã join tên.
 * Sau khi thành công, prepend vào đầu danh sách.
 */
export const createAdminBooking = createAsyncThunk(
    'adminBooking/create',
    async (
        payload: {
            customerId:   string;
            membershipId: string;
            ptServiceId:  string;
            ptId?:        string;
            totalPrice:   number;
        },
        { rejectWithValue }
    ) => {
        try {
            const data = await adminService.createBooking(payload);
            return data.booking;
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
        clearSelectedDetail: (state) => {
            state.selectedDetail = null;
            state.loadingDetail  = false;
        },
        clearCreateError: (state) => {
            state.createError = null;
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
                state.updating = action.meta.arg.bookingId;
            })
            .addCase(changeBookingStatus.fulfilled, (state, action) => {
                state.updating = null;
                const booking = state.bookings.find(b => b.id === action.payload.bookingId);
                if (booking) booking.status = action.payload.status;

                if (state.selectedDetail?.id === action.payload.bookingId) {
                    state.selectedDetail.status = action.payload.status;
                }
            })
            .addCase(changeBookingStatus.rejected, (state) => {
                state.updating = null;
            })

            // ── getBookingDetail ──────────────────────────────────────────
            .addCase(getBookingDetail.pending, (state) => {
                state.loadingDetail = true;
            })
            .addCase(getBookingDetail.fulfilled, (state, action) => {
                state.selectedDetail = action.payload;
                state.loadingDetail  = false;
            })
            .addCase(getBookingDetail.rejected, (state) => {
                state.loadingDetail = false;
            })

            // ── createAdminBooking ────────────────────────────────────────
            .addCase(createAdminBooking.pending, (state) => {
                state.creating     = true;
                state.createError  = null;
            })
            .addCase(createAdminBooking.fulfilled, (state, action) => {
                state.creating = false;
                // Thêm booking mới vào đầu danh sách
                state.bookings.unshift(action.payload);
            })
            .addCase(createAdminBooking.rejected, (state, action) => {
                state.creating    = false;
                state.createError = action.payload as string;
            });
    },
});

export const { setFilterStatus, clearSelectedDetail, clearCreateError } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;