// src/store/slices/admin/adminRevenueSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Booking } from '../../types/models';

interface RevenueState {
    currentFilter: 'month' | 'year' | 'week' | 'range';
    monthData: { month: number; year: number; totalRevenue: number; byDay: Record<number, number>; bookings: Booking[] } | null;
    yearData: { year: number; monthlyRevenue: Record<number, number> } | null;
    weekData: { week: number; year: number; startDate: string; endDate: string; dailyRevenue: Record<string, number> } | null;
    rangeData: { start: string; end: string; totalRevenue: number; count: number; bookings: Booking[] } | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: RevenueState = {
    currentFilter: 'month',
    monthData: null,
    yearData: null,
    weekData: null,
    rangeData: null,
    isLoading: false,
    error: null,
};

export const fetchRevenueByMonth = createAsyncThunk(
    'adminRevenue/fetchByMonth',
    async ({ month, year }: { month: number; year: number }) => {
        const res = await adminService.fetchRevenue(month, year);
        return res;
    }
);

export const fetchRevenueByYear = createAsyncThunk(
    'adminRevenue/fetchByYear',
    async (year: number) => {
        const res = await adminService.fetchRevenueByYear(year);
        return res;
    }
);

export const fetchRevenueByWeek = createAsyncThunk(
    'adminRevenue/fetchByWeek',
    async ({ week, year }: { week: number; year: number }) => {
        const res = await adminService.fetchRevenueByWeek(week, year);
        return res;
    }
);

export const fetchRevenueByRange = createAsyncThunk(
    'adminRevenue/fetchByRange',
    async ({ start, end }: { start: string; end: string }) => {
        const res = await adminService.fetchRevenueByRange(start, end);
        return res;
    }
);

const adminRevenueSlice = createSlice({
    name: 'adminRevenue',
    initialState,
    reducers: {
        setCurrentFilter: (state, action) => { state.currentFilter = action.payload; },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRevenueByMonth.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRevenueByMonth.fulfilled, (state, action) => { state.isLoading = false; state.monthData = action.payload; })
            .addCase(fetchRevenueByMonth.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Lỗi'; })
            .addCase(fetchRevenueByYear.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRevenueByYear.fulfilled, (state, action) => { state.isLoading = false; state.yearData = action.payload; })
            .addCase(fetchRevenueByYear.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Lỗi'; })
            .addCase(fetchRevenueByWeek.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRevenueByWeek.fulfilled, (state, action) => { state.isLoading = false; state.weekData = action.payload; })
            .addCase(fetchRevenueByWeek.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Lỗi'; })
            .addCase(fetchRevenueByRange.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRevenueByRange.fulfilled, (state, action) => { state.isLoading = false; state.rangeData = action.payload; })
            .addCase(fetchRevenueByRange.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Lỗi'; });
    },
});

export const { setCurrentFilter, clearError } = adminRevenueSlice.actions;
export default adminRevenueSlice.reducer;