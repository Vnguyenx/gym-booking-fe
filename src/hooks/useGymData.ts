// ============================================================
// Hook: useGymData
// src/hooks/useGymData.ts
//
// Thay thế hook cũ (Firestore trực tiếp) bằng Redux.
// Signature trả về giữ nguyên { gymInfo, floors, zones, loading }
// → không breaking change với code đang dùng hook này.
// ============================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchGymData } from '../store/gymSlice';

export const useGymData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { gymInfo, floors, zones, loading, error, fetched } = useSelector(
        (state: RootState) => state.gym
    );

    useEffect(() => {
        // Chỉ fetch nếu chưa có data, tránh gọi Firestore lại khi navigate
        if (!fetched) {
            dispatch(fetchGymData());
        }
    }, [fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    return { gymInfo, floors, zones, loading, error };
};