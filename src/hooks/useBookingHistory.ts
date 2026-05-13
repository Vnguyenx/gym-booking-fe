import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchBookings, updateBookingStatus } from '../store/bookingSlice';
import { customerService } from '../services/customerService';
import { UseBookingsReturn } from '../types/models';

const useBookings = (): UseBookingsReturn => {
    const dispatch = useDispatch<AppDispatch>();

    // Lấy data từ Redux store
    const { bookings, loading, error, fetched } = useSelector((state: RootState) => state.bookings);

    useEffect(() => {
        // Chỉ fetch nếu chưa có dữ liệu (fetched === false)
        if (!fetched) {
            dispatch(fetchBookings());
        }
    }, [fetched, dispatch]);

    const handleCancel = async (id: string) => {
        try {
            await customerService.cancelBooking(id);
            // Cập nhật Redux store thay vì setState nội bộ
            dispatch(updateBookingStatus({ id, status: 'cancelled' }));
        } catch (err: any) {
            alert(err.message ?? 'Không thể huỷ đăng ký.');
        }
    };

    return {
        bookings,
        isLoading: loading,
        error,
        handleCancel,
    };
};

export default useBookings;