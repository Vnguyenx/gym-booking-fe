// src/services/authService.ts
// Gom tất cả API call liên quan đến auth vào 1 chỗ
// Component không gọi fetch trực tiếp — chỉ gọi qua service này
// Lý do: dễ bảo trì, đổi URL hay logic chỉ sửa 1 chỗ

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authService = {

    // Đăng ký tài khoản mới
    // Gọi: authService.register({ email, password, displayName, phone })
    register: async (data: {
        email: string;
        password: string;
        displayName: string;
        phone: string;
    }) => {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },

    // Đăng nhập — gửi idToken lên BE, BE trả về session cookie
    // idToken lấy từ Firebase client SDK sau khi signInWithEmailAndPassword
    // Gọi: authService.login(idToken)
    login: async (idToken: string) => {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // bắt buộc để nhận và gửi cookie
            body: JSON.stringify({ idToken }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json; // { user }
    },

    // Đăng xuất — BE xóa session cookie
    // Gọi: authService.logout()
    logout: async () => {
        await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    },

    // Lấy thông tin user hiện tại — dùng khi F5 để khôi phục session
    // Trả về { user } nếu còn session, null nếu chưa đăng nhập
    // Gọi: authService.getMe()
    getMe: async () => {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            credentials: 'include',
        });
        if (!res.ok) return null;
        return res.json(); // { user }
    },
};