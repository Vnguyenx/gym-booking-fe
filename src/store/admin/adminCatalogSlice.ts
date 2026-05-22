// src/store/slices/admin/adminCatalogSlice.ts
//
// Quản lý state cho 2 danh mục:
//   - memberships (gói tập)
//   - ptServices   (dịch vụ PT)
//
// Mỗi nhóm có đầy đủ CRUD thunks.
// Thunk dùng rejectWithValue để truyền message lỗi về UI.

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Membership, PTService } from '../../types/models';

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface AdminCatalogState {
    // Danh sách gói tập
    memberships: Membership[];
    // Danh sách dịch vụ PT
    ptServices: PTService[];
    // Trạng thái loading chung cho cả 2 nhóm
    isLoading: boolean;
    // Lỗi gần nhất (null = không có lỗi)
    error: string | null;
}

const initialState: AdminCatalogState = {
    memberships: [],
    ptServices: [],
    isLoading: false,
    error: null,
};

// ─── MEMBERSHIPS THUNKS ──────────────────────────────────────────────────────

/** Lấy toàn bộ danh sách gói tập từ server */
export const fetchMemberships = createAsyncThunk(
    'adminCatalog/fetchMemberships',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchMemberships();
            return res.memberships;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Tạo gói tập mới */
export const createMembership = createAsyncThunk(
    'adminCatalog/createMembership',
    async (data: Omit<Membership, 'id'>, { rejectWithValue }) => {
        try {
            const res = await adminService.createMembership(data);
            // Trả về object đầy đủ để thêm ngay vào state (không cần fetch lại)
            return { id: res.membershipId, ...data } as Membership;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Cập nhật thông tin gói tập theo id */
export const updateMembership = createAsyncThunk(
    'adminCatalog/updateMembership',
    async (
        { id, data }: { id: string; data: Partial<Omit<Membership, 'id'>> },
        { rejectWithValue }
    ) => {
        try {
            await adminService.updateMembership(id, data);
            return { id, data }; // Trả về để reducer cập nhật state
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Xoá gói tập theo id */
export const deleteMembership = createAsyncThunk(
    'adminCatalog/deleteMembership',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteMembership(id);
            return id; // Trả về id để reducer loại khỏi danh sách
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── PT SERVICES THUNKS ──────────────────────────────────────────────────────

/** Lấy toàn bộ danh sách dịch vụ PT từ server */
export const fetchPTServices = createAsyncThunk(
    'adminCatalog/fetchPTServices',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchPTServices();
            return res.ptServices;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Tạo dịch vụ PT mới */
export const createPTService = createAsyncThunk(
    'adminCatalog/createPTService',
    async (
        // PTService.type là optional (type?) nên Omit<PTService, 'id'> vẫn cho phép type?: string
        data: Pick<PTService, 'name' | 'pricePerMonth'> & { type?: string },
        { rejectWithValue }
    ) => {
        try {
            // adminService chưa có createPTService nên gọi thẳng apiFetch
            // TODO: thêm hàm createPTService vào adminService.ts khi backend sẵn sàng
            const res = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/pt-services`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? res.statusText);
            }
            const json = await res.json();
            // PTService.id là optional (id?) nhưng server luôn trả ptServiceId
            return { id: json.ptServiceId as string, ...data } as PTService;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Cập nhật dịch vụ PT theo id */
export const updatePTService = createAsyncThunk(
    'adminCatalog/updatePTService',
    async (
        { id, data }: { id: string; data: Partial<Omit<PTService, 'id'>> },
        { rejectWithValue }
    ) => {
        try {
            await adminService.updatePTService(id, data);
            return { id, data };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Xoá dịch vụ PT theo id */
export const deletePTService = createAsyncThunk(
    'adminCatalog/deletePTService',
    async (id: string, { rejectWithValue }) => {
        try {
            // TODO: thêm hàm deletePTService vào adminService.ts
            const res = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/pt-services/${id}`,
                { method: 'DELETE', credentials: 'include' }
            );
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? res.statusText);
            }
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────

const adminCatalogSlice = createSlice({
    name: 'adminCatalog',
    initialState,
    reducers: {
        /** Xoá error thủ công (ví dụ khi đóng toast thông báo lỗi) */
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        // ── Helper: set loading / error chung ────────────────────────────────
        // Dùng hàm inline để giảm lặp code

        const setPending = (state: AdminCatalogState) => {
            state.isLoading = true;
            state.error = null;
        };

        const setError = (state: AdminCatalogState, action: any) => {
            state.isLoading = false;
            state.error = action.payload as string;
        };

        builder
            // ── fetchMemberships ─────────────────────────────────────────────
            .addCase(fetchMemberships.pending, setPending)
            .addCase(fetchMemberships.fulfilled, (state, action: PayloadAction<Membership[]>) => {
                state.isLoading = false;
                state.memberships = action.payload;
            })
            .addCase(fetchMemberships.rejected, setError)

            // ── createMembership ─────────────────────────────────────────────
            .addCase(createMembership.pending, setPending)
            .addCase(createMembership.fulfilled, (state, action: PayloadAction<Membership>) => {
                state.isLoading = false;
                // Thêm vào đầu danh sách để hiển thị ngay
                state.memberships.unshift(action.payload);
            })
            .addCase(createMembership.rejected, setError)

            // ── updateMembership ─────────────────────────────────────────────
            .addCase(updateMembership.pending, setPending)
            .addCase(updateMembership.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.memberships.findIndex((m) => m.id === id);
                if (index !== -1) {
                    // Merge field mới vào item hiện tại
                    state.memberships[index] = { ...state.memberships[index], ...data };
                }
            })
            .addCase(updateMembership.rejected, setError)

            // ── deleteMembership ─────────────────────────────────────────────
            .addCase(deleteMembership.pending, setPending)
            .addCase(deleteMembership.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.memberships = state.memberships.filter((m) => m.id !== action.payload);
            })
            .addCase(deleteMembership.rejected, setError)

            // ── fetchPTServices ──────────────────────────────────────────────
            .addCase(fetchPTServices.pending, setPending)
            .addCase(fetchPTServices.fulfilled, (state, action: PayloadAction<PTService[]>) => {
                state.isLoading = false;
                state.ptServices = action.payload;
            })
            .addCase(fetchPTServices.rejected, setError)

            // ── createPTService ──────────────────────────────────────────────
            .addCase(createPTService.pending, setPending)
            .addCase(createPTService.fulfilled, (state, action: PayloadAction<PTService>) => {
                state.isLoading = false;
                state.ptServices.unshift(action.payload);
            })
            .addCase(createPTService.rejected, setError)

            // ── updatePTService ──────────────────────────────────────────────
            .addCase(updatePTService.pending, setPending)
            .addCase(updatePTService.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.ptServices.findIndex((s) => s.id === id);
                if (index !== -1) {
                    state.ptServices[index] = { ...state.ptServices[index], ...data };
                }
            })
            .addCase(updatePTService.rejected, setError)

            // ── deletePTService ──────────────────────────────────────────────
            .addCase(deletePTService.pending, setPending)
            .addCase(deletePTService.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.ptServices = state.ptServices.filter((s) => s.id !== action.payload);
            })
            .addCase(deletePTService.rejected, setError);
    },
});

export const { clearError } = adminCatalogSlice.actions;
export default adminCatalogSlice.reducer;