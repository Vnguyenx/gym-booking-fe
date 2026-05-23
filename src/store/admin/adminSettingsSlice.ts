// src/store/slices/admin/adminSettingsSlice.ts
/**
 * Quản lý state cho gym settings (daily_config, payment)
 * Mỗi document trong collection gym_settings được quản lý riêng.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

// ─── Types ─────────────────────────────────────────────────────────────

// src/store/slices/admin/adminSettingsSlice.ts

export interface DailyConfig {
    id?: string;               // 'daily_config'
    currentSecretCode: string; // mã điểm danh, 6 ký tự
    lastUpdated: string;       // ISO date string
}

export interface PaymentConfig {
    id?: string;               // 'payment'
    bankId: string;            // tên ngân hàng
    accountNo: string;         // số tài khoản
    accountName: string;       // tên chủ tài khoản
}

interface AdminSettingsState {
    dailyConfig: DailyConfig | null;
    paymentConfig: PaymentConfig | null;
    loading: {
        daily: boolean;
        payment: boolean;
    };
    error: {
        daily: string | null;
        payment: string | null;
    };
}

const initialState: AdminSettingsState = {
    dailyConfig: null,
    paymentConfig: null,
    loading: { daily: false, payment: false },
    error: { daily: null, payment: null },
};

// ─── Thunks ─────────────────────────────────────────────────────────────

/** Lấy daily config */
export const fetchDailyConfig = createAsyncThunk(
    'adminSettings/fetchDailyConfig',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchGymSetting('daily_config');
            return res.setting as DailyConfig;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Lấy payment config */
export const fetchPaymentConfig = createAsyncThunk(
    'adminSettings/fetchPaymentConfig',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchGymSetting('payment');
            return res.setting as PaymentConfig;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Cập nhật daily config */
export const updateDailyConfig = createAsyncThunk(
    'adminSettings/updateDailyConfig',
    async (data: DailyConfig, { rejectWithValue }) => {
        try {
            await adminService.updateGymSetting('daily_config', data);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

/** Cập nhật payment config */
export const updatePaymentConfig = createAsyncThunk(
    'adminSettings/updatePaymentConfig',
    async (data: PaymentConfig, { rejectWithValue }) => {
        try {
            await adminService.updateGymSetting('payment', data);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── Slice ─────────────────────────────────────────────────────────────

const adminSettingsSlice = createSlice({
    name: 'adminSettings',
    initialState,
    reducers: {
        clearDailyError: (state) => { state.error.daily = null; },
        clearPaymentError: (state) => { state.error.payment = null; },
    },
    extraReducers: (builder) => {
        // Fetch daily
        builder.addCase(fetchDailyConfig.pending, (state) => {
            state.loading.daily = true;
            state.error.daily = null;
        });
        builder.addCase(fetchDailyConfig.fulfilled, (state, action: PayloadAction<DailyConfig>) => {
            state.loading.daily = false;
            state.dailyConfig = action.payload;
        });
        builder.addCase(fetchDailyConfig.rejected, (state, action) => {
            state.loading.daily = false;
            state.error.daily = action.payload as string;
        });

        // Fetch payment
        builder.addCase(fetchPaymentConfig.pending, (state) => {
            state.loading.payment = true;
            state.error.payment = null;
        });
        builder.addCase(fetchPaymentConfig.fulfilled, (state, action: PayloadAction<PaymentConfig>) => {
            state.loading.payment = false;
            state.paymentConfig = action.payload;
        });
        builder.addCase(fetchPaymentConfig.rejected, (state, action) => {
            state.loading.payment = false;
            state.error.payment = action.payload as string;
        });

        // Update daily
        builder.addCase(updateDailyConfig.pending, (state) => {
            state.loading.daily = true;
            state.error.daily = null;
        });
        builder.addCase(updateDailyConfig.fulfilled, (state, action: PayloadAction<DailyConfig>) => {
            state.loading.daily = false;
            state.dailyConfig = action.payload;
        });
        builder.addCase(updateDailyConfig.rejected, (state, action) => {
            state.loading.daily = false;
            state.error.daily = action.payload as string;
        });

        // Update payment
        builder.addCase(updatePaymentConfig.pending, (state) => {
            state.loading.payment = true;
            state.error.payment = null;
        });
        builder.addCase(updatePaymentConfig.fulfilled, (state, action: PayloadAction<PaymentConfig>) => {
            state.loading.payment = false;
            state.paymentConfig = action.payload;
        });
        builder.addCase(updatePaymentConfig.rejected, (state, action) => {
            state.loading.payment = false;
            state.error.payment = action.payload as string;
        });
    },
});

export const { clearDailyError, clearPaymentError } = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;