// Mirrors useEquipmentData — đọc từ Redux store, không fetch lại nếu đã có data

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchPTs } from '../store/ptSlice';
import { PT } from '../types/models';

interface UsePTDataReturn {
    pts: PT[];
    loading: boolean;
    error: string | null;
}

const usePTData = (): UsePTDataReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { pts, loading, error, fetched } = useSelector((state: RootState) => state.pt);

    useEffect(() => {
        if (!fetched) dispatch(fetchPTs());
    }, [fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    return { pts, loading, error };
};

export default usePTData;