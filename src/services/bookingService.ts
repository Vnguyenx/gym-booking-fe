const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


// ── Bật/tắt mock (đổi thành false khi BE sẵn sàng) ───────
const USE_MOCK = false;
// ─────────────────────────────────────────────────────────

export const bookingService = {

    createBooking: async (data: {
        membershipId: string;
        ptServiceId: string;
        ptId: string;
    }) => {
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
        const res = await fetch(`${BASE_URL}/api/bookings/available-pts`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    getPTServices: async () => {
        const res = await fetch(`${BASE_URL}/api/bookings/pt-services`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },
};