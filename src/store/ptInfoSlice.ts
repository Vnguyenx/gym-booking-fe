import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PTInfo } from '../types/models';

interface PTInfoState {
    ptInfo: PTInfo | null;
    loading: boolean;
    error: string | null;
    fetched: boolean;
}

const initialState: PTInfoState = {
    ptInfo: null,
    loading: false,
    error: null,
    fetched: false,
};

export const fetchPTInfo = createAsyncThunk<PTInfo, void, { rejectValue: string }>(
    'ptInfo/fetchPTInfo',
    async (_, { rejectWithValue }) => {
        try {
            const snap = await getDoc(doc(db, 'pt_info', 'main-pt'));
            if (!snap.exists()) return rejectWithValue('Không tìm thấy thông tin PT');
            return { id: snap.id, ...snap.data() } as PTInfo;
        } catch {
            return rejectWithValue('Có lỗi xảy ra khi tải dữ liệu.');
        }
    }
);

const ptInfoSlice = createSlice({
    name: 'ptInfo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPTInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPTInfo.fulfilled, (state, action) => {
                state.ptInfo = action.payload;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchPTInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default ptInfoSlice.reducer;