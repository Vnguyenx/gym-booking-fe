// ============================================================
// Hook: useBannerData
// src/hooks/useBannerData.ts
//
// Thay thế hook cũ (Firestore trực tiếp) bằng Redux.
// - Subscribe Firestore realtime → dispatch vào store.
// - Trả về data & loading từ Redux state.
// ============================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { subscribeBanners } from '../store/bannerSlice';
import { Banner } from '../types/models';

export const useBannerData = <T = Banner>(
    _collectionName: string, // giữ signature cũ để không breaking change
    activeOnly: boolean = false
) => {
    const dispatch = useDispatch<AppDispatch>();

    const { data, loading } = useSelector((state: RootState) => state.banner);

    useEffect(() => {
        // subscribeBanners trả về hàm unsubscribe
        const unsubscribe = dispatch(subscribeBanners(activeOnly));
        return () => unsubscribe();
    }, [activeOnly]); // eslint-disable-line react-hooks/exhaustive-deps

    return { data: data as T[], loading };
};