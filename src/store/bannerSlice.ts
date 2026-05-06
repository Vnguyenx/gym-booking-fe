// ============================================================
// Redux Slice: bannerSlice
// src/store/slices/bannerSlice.ts
//
// Quản lý state cho Banner: fetch từ Firestore, lưu vào Redux.
// Sử dụng onSnapshot để lắng nghe realtime.
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Banner } from '../types/models';
import { AppDispatch } from './index';

// ---- State shape ----
interface BannerState {
    data: Banner[];
    loading: boolean;
    error: string | null;
}

const initialState: BannerState = {
    data: [],
    loading: true,
    error: null,
};

// ---- Slice ----
const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        setBanners(state, action: PayloadAction<Banner[]>) {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        setBannerLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setBannerError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setBanners, setBannerLoading, setBannerError } = bannerSlice.actions;
export default bannerSlice.reducer;

// ---- Thunk: subscribe Firestore realtime ----
// Trả về hàm unsubscribe để gọi khi component unmount.
export const subscribeBanners =
    (activeOnly: boolean = false) =>
        (dispatch: AppDispatch): (() => void) => {
            dispatch(setBannerLoading(true));

            const baseQuery = activeOnly
                ? query(
                    collection(db, 'banners'),
                    where('isActive', '==', true),
                    orderBy('order', 'asc')
                )
                : query(collection(db, 'banners'), orderBy('order', 'asc'));

            const unsubscribe = onSnapshot(
                baseQuery,
                (snapshot) => {
                    const banners = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Banner[];
                    dispatch(setBanners(banners));
                },
                (err) => {
                    dispatch(setBannerError(err.message));
                }
            );

            return unsubscribe;
        };