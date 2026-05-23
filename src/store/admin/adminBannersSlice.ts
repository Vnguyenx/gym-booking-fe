// src/store/slices/admin/adminBannersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Banner } from '../../types/models';

interface AdminBannersState {
    items: Banner[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminBannersState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchBanners = createAsyncThunk(
    'adminBanners/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchBanners();
            return res.banners;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createBanner = createAsyncThunk(
    'adminBanners/createBanner',
    async (data: Omit<Banner, 'id'>, { rejectWithValue }) => {
        try {
            const res = await adminService.createBanner(data);
            return { id: res.bannerId, ...data } as Banner;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateBanner = createAsyncThunk(
    'adminBanners/updateBanner',
    async ({ id, data }: { id: string; data: Partial<Omit<Banner, 'id'>> }, { rejectWithValue }) => {
        try {
            await adminService.updateBanner(id, data);
            return { id, data };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'adminBanners/deleteBanner',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteBanner(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminBannersSlice = createSlice({
    name: 'adminBanners',
    initialState,
    reducers: { clearError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        const setPending = (state: AdminBannersState) => {
            state.isLoading = true;
            state.error = null;
        };
        const setError = (state: AdminBannersState, action: any) => {
            state.isLoading = false;
            state.error = action.payload;
        };
        builder
            .addCase(fetchBanners.pending, setPending)
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchBanners.rejected, setError)
            .addCase(createBanner.pending, setPending)
            .addCase(createBanner.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createBanner.rejected, setError)
            .addCase(updateBanner.pending, setPending)
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.items.findIndex(item => item.id === id);
                if (index !== -1) state.items[index] = { ...state.items[index], ...data };
            })
            .addCase(updateBanner.rejected, setError)
            .addCase(deleteBanner.pending, setPending)
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteBanner.rejected, setError);
    },
});

export const { clearError } = adminBannersSlice.actions;
export default adminBannersSlice.reducer;