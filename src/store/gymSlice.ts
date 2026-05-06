// ============================================================
// Redux Slice: gymSlice
//
// Quản lý state: gymInfo, floors, zones.
// Fetch một lần, cache trong store — mọi page đọc từ đây.
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GymInfo, Floor, Zone } from '../types/models';

// ── State shape ──────────────────────────────────────────────
interface GymState {
    gymInfo: GymInfo | null;
    floors: Floor[];
    zones: Zone[];
    loading: boolean;
    error: string | null;
    fetched: boolean;
}

const initialState: GymState = {
    gymInfo: null,
    floors: [],
    zones: [],
    loading: false,
    error: null,
    fetched: false,
};

// ── Async Thunk ───────────────────────────────────────────────
export const fetchGymData = createAsyncThunk<
    { gymInfo: GymInfo; floors: Floor[]; zones: Zone[] },
    void,
    { rejectValue: string }
>(
    'gym/fetchGymData',
    async (_, { rejectWithValue }) => {
        try {
            const [gymSnap, floorsSnap, zonesSnap] = await Promise.all([
                getDoc(doc(db, 'gym_info', 'main-gym')),
                getDocs(query(collection(db, 'floors'), orderBy('floorNumber', 'asc'))),
                getDocs(collection(db, 'zones')),
            ]);

            if (!gymSnap.exists()) {
                return rejectWithValue('Không tìm thấy thông tin phòng tập.');
            }

            return {
                gymInfo: { id: gymSnap.id, ...gymSnap.data() } as GymInfo,
                floors:  floorsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Floor)),
                zones:   zonesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Zone)),
            };
        } catch (err) {
            console.error('[gymSlice]', err);
            return rejectWithValue('Lỗi khi tải dữ liệu Gym.');
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────
const gymSlice = createSlice({
    name: 'gym',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGymData.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchGymData.fulfilled, (state, action) => {
                state.gymInfo = action.payload.gymInfo;
                state.floors  = action.payload.floors;
                state.zones   = action.payload.zones;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchGymData.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default gymSlice.reducer;