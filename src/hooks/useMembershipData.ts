// ============================================================
// Custom Hook: useMembershipData
// Bọc logic dispatch + selector vào một hook gọn gàng,
// để component không cần biết chi tiết về Redux.
// ============================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberships } from '../store/membershipSlice';
import type { RootState, AppDispatch } from '../store'; // Điều chỉnh đường dẫn nếu cần
import { Membership } from '../types/models';

interface UseMembershipDataReturn {
    memberships: Membership[];
    loading: boolean;
    error: string | null;
}

/**
 * useMembershipData
 *
 * Tự động fetch danh sách gói tập khi component mount.
 * Nếu đã có dữ liệu trong store thì không fetch lại.
 */
const useMembershipData = (): UseMembershipDataReturn => {
    const dispatch = useDispatch<AppDispatch>();

    const { memberships, loading, error } = useSelector(
        (state: RootState) => state.memberships
    );

    useEffect(() => {
        // Chỉ fetch khi chưa có dữ liệu để tránh gọi API thừa
        if (memberships.length === 0) {
            dispatch(fetchMemberships());
        }
    }, [dispatch, memberships.length]);

    return { memberships, loading, error };
};

export default useMembershipData;