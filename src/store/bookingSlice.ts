import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../types/models';
import { customerService } from '../services/customerService';

interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    fetched: boolean; // Flag để kiểm soát việc fetch 1 lần
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null,
    fetched: false,
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            return await customerService.getMyBookings();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        // Cập nhật trạng thái cancel ngay tại store sau khi gọi API thành công
        updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
            const booking = state.bookings.find(b => b.id === action.payload.id);
            if (booking) {
                booking.status = action.payload.status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;