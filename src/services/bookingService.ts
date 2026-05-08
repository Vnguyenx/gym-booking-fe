const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── MOCK DATA (xoá khi BE sẵn sàng) ──────────────────────
const MOCK_PT_SERVICES = [
    { id: 'pt-none',  name: 'Tự tập (Không PT)',      pricePerMonth: 0,       type: 'none'     },
    { id: 'pt-1on1',  name: 'Thuê PT kèm riêng 1:1',  pricePerMonth: 1500000, type: 'personal' },
    { id: 'pt-group', name: 'Thuê PT tập nhóm',        pricePerMonth: 800000,  type: 'group'    },
];

const MOCK_PTS = [
    {
        id: 'pt-mock-1',
        fullName: 'Nguyễn Văn Mạnh',
        avatar: 'https://i.pravatar.cc/150?img=11',
        experience: '5 năm kinh nghiệm',
        specialty: ['Gym', 'Cardio'],
        isAvailable: true,
        bio: '',
        gender: 'Nam',
        updateAt: new Date(),
    },
    {
        id: 'pt-mock-2',
        fullName: 'Trần Thị Lan',
        avatar: 'https://i.pravatar.cc/150?img=47',
        experience: '3 năm kinh nghiệm',
        specialty: ['Yoga', 'Zumba'],
        isAvailable: true,
        bio: '',
        gender: 'Nữ',
        updateAt: new Date(),
    },
];

const MOCK_BOOKING_RESULT = {
    bookingId: 'mock-booking-001',
    paymentCode: 'GYM-20260507-MOCK1',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GYM-20260507-MOCK1',
    totalPrice: 0, // sẽ tính từ hook
};

// ── Bật/tắt mock (đổi thành false khi BE sẵn sàng) ───────
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────

export const bookingService = {

    createBooking: async (data: {
        membershipId: string;
        ptServiceId: string;
        ptId: string;
    }) => {
        if (USE_MOCK) {
            // Giả lập delay network
            await new Promise(r => setTimeout(r, 1000));
            return MOCK_BOOKING_RESULT;
        }
        const res = await fetch(`${BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    getAvailablePTs: async () => {
        if (USE_MOCK) {
            await new Promise(r => setTimeout(r, 500));
            return { pts: MOCK_PTS };
        }
        const res = await fetch(`${BASE_URL}/api/bookings/available-pts`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    getPTServices: async () => {
        if (USE_MOCK) {
            await new Promise(r => setTimeout(r, 500));
            return { ptServices: MOCK_PT_SERVICES };
        }
        const res = await fetch(`${BASE_URL}/api/bookings/pt-services`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },
};