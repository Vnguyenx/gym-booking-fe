// src/store/admin/adminUserSlice.ts
//
// Quản lý:
//   users collection  (role: customer | pt)
//   pts   collection  (hồ sơ chuyên môn PT)
//   pt_applications   (đơn đăng ký làm PT)

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, PT, PTApplication } from '../../types/models';
import * as adminService from '../../services/adminService';

// ─── Filter types ─────────────────────────────────────────────────────────────

export type AdminUserRoleFilter = 'all' | 'customer' | 'pt';
export type PTApplicationStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ─── State ────────────────────────────────────────────────────────────────────

interface AdminUserState {
    // ── Users ──
    users: UserProfile[];
    loading: boolean;
    error: string | null;
    filterRole: AdminUserRoleFilter;

    // ── User detail / edit ──
    selectedUser: UserProfile | null;
    detailLoading: boolean;
    detailError: string | null;

    // ── PTs ──
    pts: PT[];
    ptsLoading: boolean;
    ptsError: string | null;
    selectedPT: PT | null;
    ptDetailLoading: boolean;
    ptDetailError: string | null;

    // ── PT Applications ──
    ptApplications: PTApplication[];
    ptAppLoading: boolean;
    ptAppError: string | null;
    ptAppFilter: PTApplicationStatusFilter;
}

const initialState: AdminUserState = {
    // Users
    users: [],
    loading: false,
    error: null,
    filterRole: 'all',

    // User detail
    selectedUser: null,
    detailLoading: false,
    detailError: null,

    // PTs
    pts: [],
    ptsLoading: false,
    ptsError: null,
    selectedPT: null,
    ptDetailLoading: false,
    ptDetailError: null,

    // PT Applications
    ptApplications: [],
    ptAppLoading: false,
    ptAppError: null,
    ptAppFilter: 'all',
};

// ══════════════════════════════════════════════════════
//  THUNKS — USERS
// ══════════════════════════════════════════════════════

/** Lấy danh sách user, lọc theo role */
export const fetchAdminUsers = createAsyncThunk(
    'adminUser/fetchAll',
    async (role: AdminUserRoleFilter, { rejectWithValue }) => {
        try {
            const roleParam = role === 'all' ? undefined : role;
            const data = await adminService.fetchUsers(roleParam);
            return data.users;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/** Lấy chi tiết 1 user → lưu vào selectedUser */
export const fetchUserById = createAsyncThunk(
    'adminUser/fetchById',
    async (uid: string, { rejectWithValue }) => {
        try {
            const data = await adminService.fetchUserById(uid);
            return data.user;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/** Cập nhật user → re-fetch list để sync */
export const editUser = createAsyncThunk(
    'adminUser/edit',
    async (
        {
            uid,
            data,
            currentFilter = 'all',
        }: {
            uid: string;
            data: Partial<Pick<UserProfile, 'displayName' | 'phone' | 'role' | 'avatarUrl'>>;
            currentFilter?: AdminUserRoleFilter;
        },
        { dispatch, rejectWithValue },
    ) => {
        try {
            await adminService.updateUser(uid, data);
            dispatch(fetchAdminUsers(currentFilter));
            return uid;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

/** Xoá user (Firestore document) */
export const removeUser = createAsyncThunk(
    'adminUser/remove',
    async (uid: string, { rejectWithValue }) => {
        try {
            await adminService.deleteUser(uid);
            return uid;
        } catch (err: any) {
            return rejectWithValue(err.message as string);
        }
    },
);

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

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {
        /** Đổi filter role cho danh sách users */
        setFilterRole(state, action: PayloadAction<AdminUserRoleFilter>) {
            state.filterRole = action.payload;
        },

        /** Đổi filter status cho danh sách PT applications */
        setPTAppFilter(state, action: PayloadAction<PTApplicationStatusFilter>) {
            state.ptAppFilter = action.payload;
        },

        /** Reset selectedUser (dùng khi đóng modal user) */
        clearSelectedUser(state) {
            state.selectedUser = null;
            state.detailError = null;
        },

        /** Reset selectedPT (dùng khi đóng modal PT) */
        clearSelectedPT(state) {
            state.selectedPT = null;
            state.ptDetailError = null;
        },
    },

    extraReducers: (builder) => {

        // ── fetchAdminUsers ───────────────────────────────────────────────────
        builder
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<UserProfile[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ── fetchUserById ─────────────────────────────────────────────────────
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
                state.selectedUser = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.detailLoading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload as string;
            });

        // ── editUser ──────────────────────────────────────────────────────────
        builder
            .addCase(editUser.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(editUser.fulfilled, (state) => {
                state.detailLoading = false;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload as string;
            });

        // ── removeUser ────────────────────────────────────────────────────────
        builder
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<string>) => {
                // Optimistic: xoá ngay khỏi list, không cần re-fetch
                state.users = state.users.filter((u) => u.uid !== action.payload);
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });

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
    setFilterRole,
    setPTAppFilter,
    clearSelectedUser,
    clearSelectedPT,
} = adminUserSlice.actions;

export default adminUserSlice.reducer;