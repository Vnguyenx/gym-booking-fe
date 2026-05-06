// ============================================================
// Hook: useEquipmentData
//
// Thay thế hook cũ (Firestore trực tiếp) bằng Redux.
// - Dispatch fetchEquipment nếu chưa có data trong store (fetched = false).
// - Trả về { equipment, loading, error } y hệt interface cũ → không breaking change.
// ============================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchEquipment } from '../store/equipmentSlice';
import { Equipment } from '../types/models';

interface UseEquipmentDataReturn {
    equipment: Equipment[];
    loading: boolean;
    error: string | null;
}

const useEquipmentData = (gymId: string = 'main-gym'): UseEquipmentDataReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const { equipment, loading, error, fetched } = useSelector(
        (state: RootState) => state.equipment
    );

    useEffect(() => {
        // Chỉ fetch nếu chưa có data, tránh gọi Firestore lại khi navigate
        if (!fetched) {
            dispatch(fetchEquipment(gymId));
        }
    }, [gymId, fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    return { equipment, loading, error };
};

export default useEquipmentData;