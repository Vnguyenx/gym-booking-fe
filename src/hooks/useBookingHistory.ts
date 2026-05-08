import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'pending';

export interface Booking {
    id: string;
    serviceName: string;   // Tên dịch vụ / lớp đặt
    instructor: string;
    date: string;          // VD: "2025-05-10"
    time: string;          // VD: "09:00"
    duration: number;      // Số phút
    status: BookingStatus;
    price: number;         // Đơn vị: VND
    note?: string;
}

export interface UseBookingsReturn {
    bookings: Booking[];
    isLoading: boolean;
}

// ─── Dữ liệu giả (mock data) ─────────────────────────────────────────────────
// TODO: Thay bằng API call thật khi backend sẵn sàng

const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'bk-001',
        serviceName: 'Yoga 1-1 cùng cô Minh Tâm',
        instructor: 'Cô Minh Tâm',
        date: '2025-05-12',
        time: '08:00',
        duration: 60,
        status: 'confirmed',
        price: 350000,
    },
    {
        id: 'bk-002',
        serviceName: 'Pilates Nhóm Nhỏ',
        instructor: 'Thầy Hoàng Nam',
        date: '2025-04-28',
        time: '19:00',
        duration: 75,
        status: 'completed',
        price: 200000,
        note: 'Buổi học rất tốt!',
    },
    {
        id: 'bk-003',
        serviceName: 'Thử lớp Yoga Buổi Sáng',
        instructor: 'Cô Minh Tâm',
        date: '2025-04-20',
        time: '06:30',
        duration: 60,
        status: 'cancelled',
        price: 0,
        note: 'Khách hàng huỷ trước 24h',
    },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useBookings
 * Lấy danh sách lịch sử booking của customer.
 * Sắp xếp theo ngày mới nhất lên đầu.
 */
const useBookings = (): UseBookingsReturn => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            try {
                // TODO: Thay bằng API call thật
                // const data = await bookingService.getMyBookings();
                // setBookings(data);

                await new Promise((resolve) => setTimeout(resolve, 500));
                // Sắp xếp mới nhất lên đầu
                const sorted = [...MOCK_BOOKINGS].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setBookings(sorted);
            } catch (error) {
                console.error('Lỗi tải lịch sử booking:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return { bookings, isLoading };
};

export default useBookings;