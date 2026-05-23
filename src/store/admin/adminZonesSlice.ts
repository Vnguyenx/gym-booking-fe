// src/store/slices/admin/adminZonesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Zone } from '../../types/models';

interface AdminZonesState {
    items: Zone[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminZonesState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchZones = createAsyncThunk(
    'adminZones/fetchZones',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchZones();
            return res.zones;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createZone = createAsyncThunk(
    'adminZones/createZone',
    async (data: Omit<Zone, 'id'>, { rejectWithValue }) => {
        try {
            const res = await adminService.createZone(data);
            return { id: res.zoneId, ...data } as Zone;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateZone = createAsyncThunk(
    'adminZones/updateZone',
    async ({ id, data }: { id: string; data: Partial<Omit<Zone, 'id'>> }, { rejectWithValue }) => {
        try {
            await adminService.updateZone(id, data);
            return { id, data };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteZone = createAsyncThunk(
    'adminZones/deleteZone',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteZone(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminZonesSlice = createSlice({
    name: 'adminZones',
    initialState,
    reducers: { clearError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        const setPending = (state: AdminZonesState) => {
            state.isLoading = true;
            state.error = null;
        };
        const setError = (state: AdminZonesState, action: any) => {
            state.isLoading = false;
            state.error = action.payload;
        };
        builder
            .addCase(fetchZones.pending, setPending)
            .addCase(fetchZones.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchZones.rejected, setError)
            .addCase(createZone.pending, setPending)
            .addCase(createZone.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createZone.rejected, setError)
            .addCase(updateZone.pending, setPending)
            .addCase(updateZone.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.items.findIndex(item => item.id === id);
                if (index !== -1) state.items[index] = { ...state.items[index], ...data };
            })
            .addCase(updateZone.rejected, setError)
            .addCase(deleteZone.pending, setPending)
            .addCase(deleteZone.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteZone.rejected, setError);
    },
});

export const { clearError } = adminZonesSlice.actions;
export default adminZonesSlice.reducer;