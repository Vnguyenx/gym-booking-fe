// Mirrors useEquipmentData — đọc từ Redux store, không fetch lại nếu đã có data

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchPTInfo } from '../store/ptInfoSlice';
import { PTInfo } from '../types/models';

interface UsePTInfoDataReturn {
    ptInfo: PTInfo | null;
    loading: boolean;
    error: string | null;
}

const usePTInfoData = (): UsePTInfoDataReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { ptInfo, loading, error, fetched } = useSelector((state: RootState) => state.ptInfo);

    useEffect(() => {
        if (!fetched) dispatch(fetchPTInfo());
    }, [fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    return { ptInfo, loading, error };
};

export default usePTInfoData;