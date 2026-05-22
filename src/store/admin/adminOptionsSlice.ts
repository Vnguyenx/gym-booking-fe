import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFloors, fetchZones } from '../../services/adminService';
import { Floor, Zone } from '../../types/models';

interface OptionsState {
    floors: Floor[];
    zones: Zone[];
    loading: boolean;
    error: string | null;
}

const initialState: OptionsState = {
    floors: [],
    zones: [],
    loading: false,
    error: null,
};

export const getFloors = createAsyncThunk('adminOptions/getFloors', async () => {
    const res = await fetchFloors();
    return res.floors;
});

export const getZones = createAsyncThunk('adminOptions/getZones', async () => {
    const res = await fetchZones();
    return res.zones;
});

const adminOptionsSlice = createSlice({
    name: 'adminOptions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFloors.pending, (state) => { state.loading = true; })
            .addCase(getFloors.fulfilled, (state, action) => {
                state.loading = false;
                state.floors = action.payload;
            })
            .addCase(getFloors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi tải floors';
            })
            .addCase(getZones.pending, (state) => { state.loading = true; })
            .addCase(getZones.fulfilled, (state, action) => {
                state.loading = false;
                state.zones = action.payload;
            })
            .addCase(getZones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi tải zones';
            });
    },
});

export default adminOptionsSlice.reducer;