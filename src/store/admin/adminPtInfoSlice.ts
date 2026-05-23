// src/store/slices/admin/adminPtInfoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { PTInfo } from '../../types/models';

interface AdminPtInfoState {
    data: PTInfo | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminPtInfoState = {
    data: null,
    isLoading: false,
    error: null,
};

export const fetchPtInfo = createAsyncThunk(
    'adminPtInfo/fetchPtInfo',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchPtInfo();
            return res.ptInfo;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updatePtInfo = createAsyncThunk(
    'adminPtInfo/updatePtInfo',
    async (data: Partial<Omit<PTInfo, 'id' | 'updateAt'>>, { rejectWithValue }) => {
        try {
            await adminService.updatePtInfo(data);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminPtInfoSlice = createSlice({
    name: 'adminPtInfo',
    initialState,
    reducers: { clearError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPtInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPtInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchPtInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePtInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePtInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = { ...state.data, ...action.payload } as PTInfo;
            })
            .addCase(updatePtInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = adminPtInfoSlice.actions;
export default adminPtInfoSlice.reducer;