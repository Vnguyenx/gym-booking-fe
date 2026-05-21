// src/store/slices/admin/adminClassSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { ClassItem, ClassStatus } from '../../types/models';

// ─── THUNKS ─────────────────────────────────────────────────────────────

// Lấy danh sách lớp
export const fetchAdminClasses = createAsyncThunk(
    'adminClass/fetchAll',
    async (filters: { status?: string; ptId?: string; customerId?: string } | undefined, { rejectWithValue }) => {
        try {
            const response = await adminService.fetchClasses(filters);
            return response.classes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Lấy chi tiết một lớp (kèm attendance)
export const fetchAdminClassDetail = createAsyncThunk(
    'adminClass/fetchDetail',
    async (classId: string, { rejectWithValue }) => {
        try {
            const response = await adminService.fetchClassById(classId);
            return response.class;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ─── SLICE VÀ STATE ─────────────────────────────────────────────────────

interface AdminClassState {
    classes: ClassItem[];
    selectedClass: ClassItem | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminClassState = {
    classes: [],
    selectedClass: null,
    isLoading: false,
    error: null,
};

const adminClassSlice = createSlice({
    name: 'adminClass',
    initialState,
    reducers: {
        // Clear lựa chọn chi tiết khi đóng modal/drawer
        clearSelectedClass: (state) => {
            state.selectedClass = null;
        },
        // Clear error thủ công nếu cần
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetchAdminClasses
            .addCase(fetchAdminClasses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminClasses.fulfilled, (state, action: PayloadAction<ClassItem[]>) => {
                state.isLoading = false;
                state.classes = action.payload;
            })
            .addCase(fetchAdminClasses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Xử lý fetchAdminClassDetail
            .addCase(fetchAdminClassDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.selectedClass = null; // Reset trước khi load data mới
            })
            .addCase(fetchAdminClassDetail.fulfilled, (state, action: PayloadAction<ClassItem>) => {
                state.isLoading = false;
                state.selectedClass = action.payload;
            })
            .addCase(fetchAdminClassDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedClass, clearError } = adminClassSlice.actions;
export default adminClassSlice.reducer;