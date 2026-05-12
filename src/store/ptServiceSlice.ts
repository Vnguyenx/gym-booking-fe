// src/store/ptServiceSlice.ts
// Quản lý trạng thái danh sách gói dịch vụ PT
// Tương tự ptSlice — có fetched để tránh fetch lại

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PTService } from '../types/models';

interface PTServiceState {
    list: PTService[];
    loading: boolean;
    error: string | null;
    fetched: boolean; // true = đã fetch rồi, không fetch lại
}

const initialState: PTServiceState = {
    list: [],
    loading: false,
    error: null,
    fetched: false,
};

export const fetchPTServices = createAsyncThunk< PTService[], void, { rejectValue: string }>(
    'ptServices/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(collection(db, 'pt_services'));
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<PTService, 'id'>),
            }));
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Không thể tải danh sách dịch vụ PT');
        }
    }
);

const ptServiceSlice = createSlice({
    name: 'ptServices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPTServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPTServices.fulfilled, (state, action: PayloadAction<PTService[]>) => {
                state.loading = false;
                state.list = action.payload;
                state.fetched = true;
            })
            .addCase(fetchPTServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default ptServiceSlice.reducer;