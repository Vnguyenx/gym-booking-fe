// src/store/slices/admin/adminEquipmentSlice.ts
//
// Quản lý state cho danh mục thiết bị (equipment).
// Tách riêng khỏi adminCatalogSlice vì equipment có nhiều field hơn
// và sau này có thể cần filter/pagination phức tạp.
//
// Mỗi thunk:
//   - pending   → bật loading
//   - fulfilled → cập nhật state, tắt loading
//   - rejected  → lưu error message, tắt loading

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Equipment } from '../../types/models';

// ─── State shape ─────────────────────────────────────────────────────────────

interface AdminEquipmentState {
    /** Danh sách thiết bị đang hiển thị */
    items: Equipment[];
    /** Đang gọi API hay không */
    isLoading: boolean;
    /** Lỗi gần nhất, null = không có lỗi */
    error: string | null;
}

const initialState: AdminEquipmentState = {
    items: [],
    isLoading: false,
    error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách thiết bị từ server.
 * Hỗ trợ filter theo zoneId hoặc floorId (optional).
 */
export const fetchEquipment = createAsyncThunk(
    'adminEquipment/fetchEquipment',
    async (filters: { zoneId?: string; floorId?: string } | undefined, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchEquipment(filters);
            return res.equipment;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/**
 * Tạo thiết bị mới.
 * Trả về object đầy đủ để thêm ngay vào store (không cần fetch lại).
 */
export const createEquipment = createAsyncThunk(
    'adminEquipment/createEquipment',
    async (data: Omit<Equipment, 'id' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const res = await adminService.createEquipment(data);
            // Ghép id mới trả về từ server với data đã gửi lên
            return { id: res.equipmentId, ...data, updatedAt: new Date() } as Equipment;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/**
 * Cập nhật thiết bị theo id.
 * Chỉ gửi các field thay đổi (Partial).
 */
export const updateEquipment = createAsyncThunk(
    'adminEquipment/updateEquipment',
    async (
        { id, data }: { id: string; data: Partial<Omit<Equipment, 'id' | 'updatedAt'>> },
        { rejectWithValue }
    ) => {
        try {
            await adminService.updateEquipment(id, data);
            // Trả về id + data để reducer merge vào state
            return { id, data };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/**
 * Xoá thiết bị theo id.
 * Trả về id đã xoá để reducer lọc ra khỏi danh sách.
 */
export const deleteEquipment = createAsyncThunk(
    'adminEquipment/deleteEquipment',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteEquipment(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminEquipmentSlice = createSlice({
    name: 'adminEquipment',
    initialState,
    reducers: {
        /** Xoá error thủ công — dùng khi đóng toast thông báo lỗi */
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        // ── Helper nội bộ: tránh lặp code ───────────────────────────────────
        const setPending = (state: AdminEquipmentState) => {
            state.isLoading = true;
            state.error = null;
        };
        const setError = (state: AdminEquipmentState, action: any) => {
            state.isLoading = false;
            state.error = action.payload as string;
        };

        builder
            // ── Fetch ────────────────────────────────────────────────────────
            .addCase(fetchEquipment.pending, setPending)
            .addCase(fetchEquipment.fulfilled, (state, action: PayloadAction<Equipment[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchEquipment.rejected, setError)

            // ── Create ───────────────────────────────────────────────────────
            .addCase(createEquipment.pending, setPending)
            .addCase(createEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => {
                state.isLoading = false;
                // Thêm vào đầu danh sách để admin thấy ngay item mới tạo
                state.items.unshift(action.payload);
            })
            .addCase(createEquipment.rejected, setError)

            // ── Update ───────────────────────────────────────────────────────
            .addCase(updateEquipment.pending, setPending)
            .addCase(updateEquipment.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    // Merge field mới vào item hiện tại (không thay thế toàn bộ)
                    state.items[index] = { ...state.items[index], ...data };
                }
            })
            .addCase(updateEquipment.rejected, setError)

            // ── Delete ───────────────────────────────────────────────────────
            .addCase(deleteEquipment.pending, setPending)
            .addCase(deleteEquipment.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteEquipment.rejected, setError);
    },
});

export const { clearError } = adminEquipmentSlice.actions;
export default adminEquipmentSlice.reducer;