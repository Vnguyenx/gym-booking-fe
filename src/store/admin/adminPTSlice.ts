// src/store/admin/adminPTSlice.ts
//
// Quản lý:
//   pts collection  (hồ sơ chuyên môn PT)

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { PT } from '../../types/models';
import * as adminService from '../../services/adminService';

// ─── State ────────────────────────────────────────────────────────────────────

interface AdminPTState {
    // ── PTs ──
    pts: PT[];
    ptsLoading: boolean;
    ptsError: string | null;
    selectedPT: PT | null;
    ptDetailLoading: boolean;
    ptDetailError: string | null;
}

const initialState: AdminPTState = {
    // PTs
    pts: [],
    ptsLoading: false,
    ptsError: null,
    selectedPT: null,
    ptDetailLoading: false,
    ptDetailError: null,
};

// ══════════════════════════════════════════════════════
//  THUNKS — PTs
// ══════════════════════════════════════════════════════

/** Lấy danh sách hồ sơ chuyên môn PT */
export const fetchAdminPTs = createAsyncThunk(
    'adminUser/fetchPTs',
    async (_, { rejectWithValue }) => {
        try {
            const data = await adminService.fetchPTs();
            return data.pts;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/** Lấy chi tiết 1 PT → lưu vào selectedPT */
export const fetchPTById = createAsyncThunk(
    'adminUser/fetchPTById',
    async (ptId: string, { rejectWithValue }) => {
        try {
            const data = await adminService.fetchPTById(ptId);
            return data.pt;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/** Cập nhật hồ sơ PT → re-fetch list */
export const editPT = createAsyncThunk(
    'adminUser/editPT',
    async (
        {
            ptId,
            data,
        }: {
            ptId: string;
            data: Partial<Omit<PT, 'id' | 'updateAt'>>;
        },
        { dispatch, rejectWithValue },
    ) => {
        try {
            await adminService.updatePT(ptId, data);
            dispatch(fetchAdminPTs());
            return ptId;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

// ══════════════════════════════════════════════════════
//  SLICE
// ══════════════════════════════════════════════════════

const adminPTSlice = createSlice({
    name: 'adminPT',
    initialState,
    reducers: {
        /** Reset selectedPT (dùng khi đóng modal PT) */
        clearSelectedPT(state) {
            state.selectedPT = null;
            state.ptDetailError = null;
        },
    },

    extraReducers: (builder) => {

        // ── fetchAdminPTs ─────────────────────────────────────────────────────
        builder
            .addCase(fetchAdminPTs.pending, (state) => {
                state.ptsLoading = true;
                state.ptsError = null;
            })
            .addCase(fetchAdminPTs.fulfilled, (state, action: PayloadAction<PT[]>) => {
                state.ptsLoading = false;
                state.pts = action.payload;
            })
            .addCase(fetchAdminPTs.rejected, (state, action) => {
                state.ptsLoading = false;
                state.ptsError = action.payload as string;
            });

        // ── fetchPTById ───────────────────────────────────────────────────────
        builder
            .addCase(fetchPTById.pending, (state) => {
                state.ptDetailLoading = true;
                state.ptDetailError = null;
                state.selectedPT = null;
            })
            .addCase(fetchPTById.fulfilled, (state, action: PayloadAction<PT>) => {
                state.ptDetailLoading = false;
                state.selectedPT = action.payload;
            })
            .addCase(fetchPTById.rejected, (state, action) => {
                state.ptDetailLoading = false;
                state.ptDetailError = action.payload as string;
            });

        // ── editPT ────────────────────────────────────────────────────────────
        builder
            .addCase(editPT.pending, (state) => {
                state.ptDetailLoading = true;
                state.ptDetailError = null;
            })
            .addCase(editPT.fulfilled, (state) => {
                state.ptDetailLoading = false;
            })
            .addCase(editPT.rejected, (state, action) => {
                state.ptDetailLoading = false;
                state.ptDetailError = action.payload as string;
            });
    },
});

export const {
    clearSelectedPT,
} = adminPTSlice.actions;

export default adminPTSlice.reducer;