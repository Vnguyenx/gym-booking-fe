// src/hooks/useClasses.ts
// Mirrors usePTData — đọc từ Redux store, không fetch lại nếu đã có data.
// Mọi component dùng hook này đều share cùng 1 cache.

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../store';
import { fetchClasses, selectClass, clearSelection } from '../store/classSlice';
import { UseClassesReturn } from '../types/models';

const useClasses = (): UseClassesReturn => {
    const dispatch = useDispatch<AppDispatch>();

    const { classes, loading, error, fetched, selectedClassId } =
        useSelector((state: RootState) => state.classes);

    // Chỉ fetch khi chưa có data — giống pattern của usePTData
    useEffect(() => {
        if (!fetched) dispatch(fetchClasses());
    }, [fetched]); // eslint-disable-line react-hooks/exhaustive-deps

    const selectedClass = classes.find((c) => c.id === selectedClassId);

    return {
        classes,
        isLoading: loading,
        error,
        selectedClassId,
        selectedClass,
        selectClass:    (id: string) => dispatch(selectClass(id)),
        clearSelection: ()           => dispatch(clearSelection()),
    };
};

export default useClasses;