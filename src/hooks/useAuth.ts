// hooks/useAuth.ts
// Hook tùy chỉnh để lấy thông tin xác thực người dùng
// Dùng hook này ở bất kỳ component nào cần biết:
// user hiện tại là ai, role gì, đã đăng nhập chưa

import { useAppSelector } from '../store/hooks';

const useAuth = () => {
    // Lấy các giá trị từ auth slice trong Redux store
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.auth.loading);
    const error = useAppSelector((state) => state.auth.error);

    return {
        user,                             // object User hoặc null
        loading,                          // đang xử lý hay không
        error,                            // thông báo lỗi hoặc null
        isLoggedIn: !!user,               // true nếu đã đăng nhập
        isCustomer: user?.role === 'customer', // true nếu là khách hàng
        isPT: user?.role === 'pt',             // true nếu là huấn luyện viên
        isAdmin: user?.role === 'admin',       // true nếu là admin
    };
};

export default useAuth;