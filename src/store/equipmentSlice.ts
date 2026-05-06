// ============================================================
// Redux Slice: equipmentSlice
//
// Quản lý toàn bộ state Equipment:
// - Fetch một lần từ Firestore (getDocs), cache trong store.
// - Mọi page/component đọc từ store, không fetch lại.
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Equipment } from '../types/models';

// ── State shape ──────────────────────────────────────────────
interface EquipmentState {
    equipment: Equipment[];
    loading: boolean;
    error: string | null;
    fetched: boolean; // tránh fetch lại khi đã có data
}

const initialState: EquipmentState = {
    equipment: [],
    loading: false,
    error: null,
    fetched: false,
};

// ── Async Thunk: fetch Firestore ──────────────────────────────
export const fetchEquipment = createAsyncThunk<
    Equipment[],
    string,           // gymId
    { rejectValue: string }
>(
    'equipment/fetchEquipment',
    async (gymId = 'main-gym', { rejectWithValue }) => {
        try {
            const q = query(
                collection(db, 'equipment'),
                where('gymId', '==', gymId),
                orderBy('updatedAt', 'desc')
            );

            const snapshot = await getDocs(q);

            return snapshot.docs.map((doc) => {
                const raw = doc.data();
                return {
                    id:           doc.id,
                    category:     raw.category     ?? '',
                    subCategory:  raw.subCategory  ?? '',
                    name:         raw.name         ?? '',
                    nameVi:       raw.nameVi       ?? '',
                    description:  raw.description  ?? '',
                    tips:         raw.tips         ?? '',
                    floorId:      raw.floorId      ?? '',
                    gymId:        raw.gymId        ?? '',
                    zoneId:       raw.zoneId       ?? '',
                    imageUrls:    raw.imageUrls    ?? [],
                    isActive:     raw.isActive     ?? true,
                    quantity:     raw.quantity     ?? 0,
                    muscleGroups: raw.muscleGroups ?? [],
                    updatedAt: raw.updatedAt instanceof Timestamp
                        ? raw.updatedAt.toDate()
                        : new Date(raw.updatedAt ?? Date.now()),
                } satisfies Equipment;
            });
        } catch (err) {
            console.error('[equipmentSlice]', err);
            return rejectWithValue('Không thể tải dữ liệu thiết bị. Vui lòng thử lại.');
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────
const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipment.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchEquipment.fulfilled, (state, action: PayloadAction<Equipment[]>) => {
                state.equipment = action.payload;
                state.loading   = false;
                state.fetched   = true;
            })
            .addCase(fetchEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default equipmentSlice.reducer;