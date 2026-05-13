// store/slices/classSlice.ts
// Quản lý danh sách lớp học + điểm danh của customer trong Redux store.
// Chỉ fetch 1 lần khi chưa có data (fetched === false),
// tránh gọi API lại mỗi lần customer chuyển tab.

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClassItem } from '../types/models';
import { customerService } from '../services/customerService';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClassState {
    classes: ClassItem[];
    loading: boolean;
    error: string | null;
    fetched: boolean;          // true = đã fetch ít nhất 1 lần, không fetch lại
    selectedClassId: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: ClassState = {
    classes:         [],
    loading:         false,
    error:           null,
    fetched:         false,
    selectedClassId: null,
};

// ─── Async thunk ──────────────────────────────────────────────────────────────

/**
 * fetchClasses
 * Gọi API lấy danh sách lớp học + attendance subcollection.
 * Chỉ dispatch khi fetched === false (xem useClasses.ts).
 */
export const fetchClasses = createAsyncThunk(
    'classes/fetchClasses',
    async (_, { rejectWithValue }) => {
        try {
            return await customerService.getMyClasses();
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Không thể tải danh sách lớp học.');
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const classSlice = createSlice({
    name: 'classes',
    initialState,
    reducers: {
        // Chọn / bỏ chọn một class để xem chi tiết điểm danh
        selectClass: (state, action: PayloadAction<string>) => {
            state.selectedClassId = action.payload;
        },
        clearSelection: (state) => {
            state.selectedClassId = null;
        },

        // Dùng sau khi checkin thành công để cập nhật store
        // mà không cần fetch lại toàn bộ
        addAttendanceRecord: (state, action: PayloadAction<{
            classId: string;
            record: ClassItem['attendance'][number];
        }>) => {
            const cls = state.classes.find((c) => c.id === action.payload.classId);
            if (cls) {
                cls.attendance.unshift(action.payload.record); // mới nhất lên đầu
                cls.usedSessions += 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.classes = action.payload;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.error   = action.payload as string;
                state.loading = false;
            });
    },
});

export const { selectClass, clearSelection, addAttendanceRecord } = classSlice.actions;
export default classSlice.reducer;