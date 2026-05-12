// src/services/customerService.ts
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const customerService = {

    updateProfile: async (data: {
        displayName: string;
        phone: string;
        avatarUrl?: string;
    }) => {
        const res = await fetch(`${BASE_URL}/api/customer/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    getMyBookings: async () => {
        const res = await fetch(`${BASE_URL}/api/customer/bookings`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json.bookings;
    },

    getMyClasses: async () => {
        const res = await fetch(`${BASE_URL}/api/customer/classes`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json.classes;
    },

    // Huỷ booking — chỉ được huỷ khi status === 'pending'
    cancelBooking: async (id: string) => {
        const res = await fetch(`${BASE_URL}/api/customer/bookings/${id}/cancel`, {
            method: 'PATCH',
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    getPTs: async () => {
        const res = await fetch(`${BASE_URL}/api/pts`, {
            credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json.pts;
    },
};