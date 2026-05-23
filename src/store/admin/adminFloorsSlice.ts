// src/store/slices/admin/adminFloorsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { Floor } from '../../types/models';

interface AdminFloorsState {
    items: Floor[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminFloorsState = {
    items: [],
    isLoading: false,
    error: null,
};

// Thunks
export const fetchFloors = createAsyncThunk(
    'adminFloors/fetchFloors',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.fetchFloors();
            return res.floors;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createFloor = createAsyncThunk(
    'adminFloors/createFloor',
    async (data: Omit<Floor, 'id'>, { rejectWithValue }) => {
        try {
            const res = await adminService.createFloor(data);
            return { id: res.floorId, ...data } as Floor;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateFloor = createAsyncThunk(
    'adminFloors/updateFloor',
    async ({ id, data }: { id: string; data: Partial<Omit<Floor, 'id'>> }, { rejectWithValue }) => {
        try {
            await adminService.updateFloor(id, data);
            return { id, data };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteFloor = createAsyncThunk(
    'adminFloors/deleteFloor',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteFloor(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const adminFloorsSlice = createSlice({
    name: 'adminFloors',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        const setPending = (state: AdminFloorsState) => {
            state.isLoading = true;
            state.error = null;
        };
        const setError = (state: AdminFloorsState, action: any) => {
            state.isLoading = false;
            state.error = action.payload;
        };
        builder
            .addCase(fetchFloors.pending, setPending)
            .addCase(fetchFloors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchFloors.rejected, setError)
            .addCase(createFloor.pending, setPending)
            .addCase(createFloor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createFloor.rejected, setError)
            .addCase(updateFloor.pending, setPending)
            .addCase(updateFloor.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                const index = state.items.findIndex(item => item.id === id);
                if (index !== -1) state.items[index] = { ...state.items[index], ...data };
            })
            .addCase(updateFloor.rejected, setError)
            .addCase(deleteFloor.pending, setPending)
            .addCase(deleteFloor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteFloor.rejected, setError);
    },
});

export const { clearError } = adminFloorsSlice.actions;
export default adminFloorsSlice.reducer;