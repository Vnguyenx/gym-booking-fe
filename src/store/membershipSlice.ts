// ============================================================
// Redux Slice: membershipSlice
// Quản lý trạng thái danh sách gói tập (memberships)
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase'; // Điều chỉnh đường dẫn nếu cần
import { Membership } from '../types/models';

// ---------- State type ----------
interface MembershipState {
    memberships: Membership[];
    loading: boolean;
    error: string | null;
}

const initialState: MembershipState = {
    memberships: [],
    loading: false,
    error: null,
};

// ---------- Async Thunk: fetch từ Firestore ----------
/**
 * fetchMemberships
 * Lấy toàn bộ gói tập từ collection 'memberships',
 * sắp xếp theo durationMonths tăng dần.
 */
export const fetchMemberships = createAsyncThunk<
    Membership[],   // kiểu trả về khi thành công
    void,           // không cần tham số đầu vào
    { rejectValue: string }
>(
    'memberships/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const q = query(
                collection(db, 'memberships'),
                orderBy('durationMonths', 'asc')
            );
            const snapshot = await getDocs(q);

            // Map mỗi document thành object Membership
            const data: Membership[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Membership, 'id'>),
            }));

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message ?? 'Không thể tải danh sách gói tập');
        }
    }
);

// ---------- Slice ----------
const membershipSlice = createSlice({
    name: 'memberships',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Đang fetch...
            .addCase(fetchMemberships.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fetch thành công
            .addCase(fetchMemberships.fulfilled, (state, action: PayloadAction<Membership[]>) => {
                state.loading = false;
                state.memberships = action.payload;
            })
            // Fetch thất bại
            .addCase(fetchMemberships.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Lỗi không xác định';
            });
    },
});

export default membershipSlice.reducer;