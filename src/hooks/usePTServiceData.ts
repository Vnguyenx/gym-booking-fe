// src/hooks/usePTServiceData.ts
// Hook fetch danh sách gói dịch vụ PT từ Redux store
// Tương tự useMembershipData và usePTData

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPTServices } from '../store/ptServiceSlice';
import type { RootState, AppDispatch } from '../store';
import { PTService } from '../types/models';

interface UsePTServiceDataReturn {
    ptServices: PTService[];
    loading: boolean;
    error: string | null;
}

const usePTServiceData = (): UsePTServiceDataReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: ptServices, loading, error, fetched } = useSelector(
        (state: RootState) => state.ptServices
    );

    useEffect(() => {
        // Chỉ fetch khi chưa có data
        if (!fetched) dispatch(fetchPTServices());
    }, [fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    return { ptServices, loading, error };
};

export default usePTServiceData;