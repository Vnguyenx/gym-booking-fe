import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PT } from '../types/models';

interface PTState {
    pts: PT[];
    loading: boolean;
    error: string | null;
    fetched: boolean;
}

const initialState: PTState = {
    pts: [],
    loading: false,
    error: null,
    fetched: false,
};

export const fetchPTs = createAsyncThunk<PT[], void, { rejectValue: string }>(
    'pt/fetchPTs',
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(collection(db, 'pts'));
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PT));
        } catch (err) {
            return rejectWithValue('Không thể tải danh sách PT. Vui lòng thử lại.');
        }
    }
);

const ptSlice = createSlice({
    name: 'pt',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPTs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPTs.fulfilled, (state, action) => {
                state.pts = action.payload;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchPTs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default ptSlice.reducer;