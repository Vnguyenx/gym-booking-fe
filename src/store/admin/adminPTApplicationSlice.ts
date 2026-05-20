// src/store/admin/adminPTApplicationSlice.ts
//
// Quản lý:
//   pt_applications  (đơn đăng ký làm PT)

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { PTApplication } from '../../types/models';
import * as adminService from '../../services/adminService';

// ─── Filter types ─────────────────────────────────────────────────────────────

export type PTApplicationStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ─── State ────────────────────────────────────────────────────────────────────

interface AdminPTApplicationState {
    // ── PT Applications ──
    ptApplications: PTApplication[];
    ptAppLoading: boolean;
    ptAppError: string | null;
    ptAppFilter: PTApplicationStatusFilter;
}

const initialState: AdminPTApplicationState = {
    // PT Applications
    ptApplications: [],
    ptAppLoading: false,
    ptAppError: null,
    ptAppFilter: 'all',
};

// ══════════════════════════════════════════════════════
//  THUNKS — PT APPLICATIONS
// ══════════════════════════════════════════════════════

/** Lấy danh sách đơn đăng ký PT, lọc theo status */
export const fetchPTApplications = createAsyncThunk(
    'adminUser/fetchPTApplications',
    async (status: PTApplicationStatusFilter, { rejectWithValue }) => {
        try {
            const statusParam =
                status === 'all' ? undefined : (status as PTApplication['status']);
            const data = await adminService.fetchPTApplications(statusParam);
            return data.applications;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/**
 * Duyệt / từ chối đơn PT.
 * Sau khi thành công → re-fetch list với filter hiện tại.
 */
export const reviewPTApplication = createAsyncThunk(
    'adminUser/reviewPTApplication',
    async (
        {
            id,
            status,
            currentFilter = 'all',
        }: {
            id: string;
            status: 'approved' | 'rejected';
            currentFilter?: PTApplicationStatusFilter;
        },
        { dispatch, rejectWithValue },
    ) => {
        try {
            await adminService.reviewPTApplication(id, status);
            dispatch(fetchPTApplications(currentFilter));
            return { id, status };
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

// ══════════════════════════════════════════════════════
//  SLICE
// ══════════════════════════════════════════════════════

const adminPTApplicationSlice = createSlice({
    name: 'adminPTApplication',
    initialState,
    reducers: {
        /** Đổi filter status cho danh sách PT applications */
        setPTAppFilter(state, action: PayloadAction<PTApplicationStatusFilter>) {
            state.ptAppFilter = action.payload;
        },
    },

    extraReducers: (builder) => {

        // ── fetchPTApplications ───────────────────────────────────────────────
        builder
            .addCase(fetchPTApplications.pending, (state) => {
                state.ptAppLoading = true;
                state.ptAppError = null;
            })
            .addCase(fetchPTApplications.fulfilled, (state, action: PayloadAction<PTApplication[]>) => {
                state.ptAppLoading = false;
                state.ptApplications = action.payload;
            })
            .addCase(fetchPTApplications.rejected, (state, action) => {
                state.ptAppLoading = false;
                state.ptAppError = action.payload as string;
            });

        // ── reviewPTApplication ───────────────────────────────────────────────
        builder
            .addCase(reviewPTApplication.pending, (state) => {
                state.ptAppLoading = true;
                state.ptAppError = null;
            })
            .addCase(reviewPTApplication.fulfilled, (state) => {
                state.ptAppLoading = false;
            })
            .addCase(reviewPTApplication.rejected, (state, action) => {
                state.ptAppLoading = false;
                state.ptAppError = action.payload as string;
            });
    },
});

export const {
    setPTAppFilter,
} = adminPTApplicationSlice.actions;

export default adminPTApplicationSlice.reducer;