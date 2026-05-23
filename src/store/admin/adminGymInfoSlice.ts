// src/store/slices/admin/adminGymInfoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { GymInfo } from '../../types/models';

interface AdminGymInfoState {
    data: GymInfo | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminGymInfoState = {
    data: null,
    isLoading: false,
    error: null,
};

export const fetchGymInfo = createAsyncThunk(
    'adminGymInfo/fetchGymInfo',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchGymInfo();
            return res.gymInfo;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateGymInfo = createAsyncThunk(
    'adminGymInfo/updateGymInfo',
    async (data: Partial<Omit<GymInfo, 'id'>>, { rejectWithValue }) => {
        try {
            await adminService.updateGymInfo(data);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminGymInfoSlice = createSlice({
    name: 'adminGymInfo',
    initialState,
    reducers: { clearError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGymInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGymInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchGymInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateGymInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateGymInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = { ...state.data, ...action.payload } as GymInfo;
            })
            .addCase(updateGymInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = adminGymInfoSlice.actions;
export default adminGymInfoSlice.reducer;