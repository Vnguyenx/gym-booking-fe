// src/store/admin/adminUserSlice.ts
//
// Quản lý:
//   users collection  (role: customer | pt)

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types/models';
import * as adminService from '../../services/adminService';

// ─── Filter types ─────────────────────────────────────────────────────────────

export type AdminUserRoleFilter = 'all' | 'customer' | 'pt';

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

        /** Reset selectedUser (dùng khi đóng modal user) */
        clearSelectedUser(state) {
            state.selectedUser = null;
            state.detailError = null;
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
    },
});

export const {
    setFilterRole,
    clearSelectedUser,
} = adminUserSlice.actions;

export default adminUserSlice.reducer;