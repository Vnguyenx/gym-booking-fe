import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { Booking, UseBookingsReturn } from '../types/models';

/**
 * useBookings
 * Lấy lịch sử đăng ký gói tập của customer.
 * Booking có status "pending" thì cho phép huỷ.
 */
const useBookings = (): UseBookingsReturn => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await customerService.getMyBookings();
                setBookings(data);
            } catch (err: any) {
                console.error('Lỗi tải lịch sử booking:', err);
                setError(err.message ?? 'Không thể tải lịch sử đăng ký. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        try {
            await customerService.cancelBooking(id);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
            );
        } catch (err: any) {
            alert(err.message ?? 'Huỷ thất bại. Vui lòng thử lại.');
        }
    };

    return { bookings, isLoading, error, handleCancel };
};

export default useBookings;