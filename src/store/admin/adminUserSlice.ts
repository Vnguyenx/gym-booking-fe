// src/store/adminUserSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/models';
import * as adminService from '../../services/adminService';

export type AdminUserRoleFilter = 'all' | 'customer' | 'pt';

interface AdminUserState {
    users: UserProfile[];
    loading: boolean;
    error: string | null;
    filterRole: AdminUserRoleFilter;
}

const initialState: AdminUserState = {
    users: [],
    loading: false,
    error: null,
    filterRole: 'all',
};

export const fetchAdminUsers = createAsyncThunk(
    'adminUser/fetchAll',
    async (role: AdminUserRoleFilter, { rejectWithValue }) => {
        try {
            const roleParam = role === 'all' ? undefined : role;
            const data = await adminService.fetchUsers(roleParam);
            return data.users;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const removeUser = createAsyncThunk(
    'adminUser/remove',
    async (uid: string, { rejectWithValue }) => {
        try {
            await adminService.deleteUser(uid);
            return uid;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {
        setFilterRole: (state, action) => {
            state.filterRole = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.uid !== action.payload);
            });
    },
});

export const { setFilterRole } = adminUserSlice.actions;
export default adminUserSlice.reducer;