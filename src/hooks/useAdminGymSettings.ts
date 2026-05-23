// src/hooks/admin/useGymSettingsForm.ts
import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchDailyConfig,
    fetchPaymentConfig,
    updateDailyConfig,
    updatePaymentConfig,
    DailyConfig,
    PaymentConfig,
} from '../store/admin/adminSettingsSlice';
import { toUpperCaseNoDiacritics } from '../utils/stringUtils';

export const useGymSettingsForm = () => {
    const dispatch = useAppDispatch();
    const { dailyConfig, paymentConfig, loading, error } = useAppSelector(
        (state) => state.adminSettings
    );

    const [dailyEditData, setDailyEditData] = useState<DailyConfig | null>(null);
    const [paymentEditData, setPaymentEditData] = useState<PaymentConfig | null>(null);

    // Đồng bộ edit data khi config thay đổi (sau fetch hoặc update)
    useEffect(() => {
        if (dailyConfig) setDailyEditData(dailyConfig);
    }, [dailyConfig]);

    useEffect(() => {
        if (paymentConfig) setPaymentEditData(paymentConfig);
    }, [paymentConfig]);

    // Fetch lần đầu
    useEffect(() => {
        dispatch(fetchDailyConfig());
        dispatch(fetchPaymentConfig());
    }, [dispatch]);

    const handleDailySave = useCallback(async () => {
        if (!dailyEditData) return;

        let code = dailyEditData.currentSecretCode?.toUpperCase() || '';
        code = code.replace(/[^A-Z0-9]/g, '');
        if (code.length !== 6) {
            alert('Mã điểm danh phải có đúng 6 ký tự chữ/số');
            return;
        }

        const { id, ...toSave } = dailyEditData;
        toSave.currentSecretCode = code;
        if (!toSave.lastUpdated) {
            toSave.lastUpdated = new Date().toISOString();
        }

        await dispatch(updateDailyConfig(toSave)).unwrap();
        // ✅ Update thành công -> fetch lại dữ liệu từ server
        await dispatch(fetchDailyConfig()).unwrap();
    }, [dispatch, dailyEditData]);

    const handlePaymentSave = useCallback(async () => {
        if (!paymentEditData) return;

        const normalizedName = toUpperCaseNoDiacritics(paymentEditData.accountName || '');
        const { id, ...toSave } = paymentEditData;
        toSave.accountName = normalizedName;

        await dispatch(updatePaymentConfig(toSave)).unwrap();
        // ✅ Update thành công -> fetch lại dữ liệu từ server
        await dispatch(fetchPaymentConfig()).unwrap();
    }, [dispatch, paymentEditData]);

    const resetDailyForm = useCallback(() => {
        setDailyEditData(dailyConfig);
    }, [dailyConfig]);

    const resetPaymentForm = useCallback(() => {
        setPaymentEditData(paymentConfig);
    }, [paymentConfig]);

    const isDailyDirty = JSON.stringify(dailyEditData) !== JSON.stringify(dailyConfig);
    const isPaymentDirty = JSON.stringify(paymentEditData) !== JSON.stringify(paymentConfig);

    return {
        dailyEditData,
        dailyLoading: loading.daily,
        dailyError: error.daily,
        setDailyEditData,
        handleDailySave,
        resetDailyForm,
        isDailyDirty,

        paymentEditData,
        paymentLoading: loading.payment,
        paymentError: error.payment,
        setPaymentEditData,
        handlePaymentSave,
        resetPaymentForm,
        isPaymentDirty,
    };
};