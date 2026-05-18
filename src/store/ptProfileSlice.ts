// src/store/slices/ptProfileSlice.ts
//
// Slice fetch thông tin chi tiết của PT đang đăng nhập từ collection `pts`.
// Tách riêng với authSlice vì:
//   - authSlice chứa session info (uid, email, role, phone)
//   - ptProfileSlice chứa PT-specific info (bio, specialty, experience, isAvailable, avatar)
//
// Fetch 1 lần khi PT vào dashboard — dùng flag `fetched` giống pattern của ptSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PT } from '../types/models';
import { fetchMyPtProfile as fetchMyPtProfileApi } from '../services/ptService';


// ─── State ────────────────────────────────────────────────────────────────────

interface PtProfileState {
    profile:  PT | null;
    loading:  boolean;
    error:    string | null;
    fetched:  boolean;   // true sau khi fetch thành công → không fetch lại khi chuyển tab
}

const initialState: PtProfileState = {
    profile: null,
    loading: false,
    error:   null,
    fetched: false,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * Fetch thông tin PT đang đăng nhập từ collection `pts`.
 * BE đọc uid từ session cookie → trả về PT object.
 * GET /api/pt/me
 */
export const fetchMyPtProfile = createAsyncThunk<PT, void, { rejectValue: string }>(
    'ptProfile/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const json = await fetchMyPtProfileApi(); // ← qua service
            return json.pt;
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Không thể tải hồ sơ PT');
        }
    },
);

/**
 * Cập nhật local store sau khi updatePTProfile thành công.
 * Không fetch lại — chỉ merge Partial<PT> vào store.
 */
export const updatePtProfileInStore = createAsyncThunk<
    Partial<PT>,
    Partial<PT>,
    { rejectValue: string }
>(
    'ptProfile/updateInStore',
    async (data) => data,
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const ptProfileSlice = createSlice({
    name: 'ptProfile',
    initialState,
    reducers: {
        /** Reset khi logout */
        clearPtProfile(state) {
            state.profile = null;
            state.fetched = false;
            state.error   = null;
        },
    },
    extraReducers: (builder) => {
        // fetchMyPtProfile
        builder
            .addCase(fetchMyPtProfile.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchMyPtProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.fetched = true;
                state.profile = action.payload;
            })
            .addCase(fetchMyPtProfile.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload ?? 'Lỗi không xác định';
            });

        // updatePtProfileInStore — merge partial update vào store
        builder.addCase(updatePtProfileInStore.fulfilled, (state, action) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        });
    },
});

export const { clearPtProfile } = ptProfileSlice.actions;
export default ptProfileSlice.reducer;