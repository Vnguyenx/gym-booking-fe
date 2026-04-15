import { useState } from 'react';

const useValidator = () => {
    const [showPassword, setShowPassword] = useState(false);

    // 1. Logic ẩn hiện mật khẩu
    const togglePassword = () => setShowPassword(!showPassword);

    // 2. Kiểm tra mật khẩu mạnh
    // Ít nhất 8 ký tự, 1 hoa, 1 số, 1 ký tự đặc biệt
    const validatePassword = (pass: string) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pass);
    };

    // 3. Kiểm tra số điện thoại (Việt Nam)
    const validatePhone = (phone: string) => {
        const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return regex.test(phone);
    };

    return {
        showPassword,
        togglePassword,
        validatePassword,
        validatePhone,
        // Helper để check nhanh
        isMatch: (pass: string, confirm: string) => pass === confirm
    };
};

export default useValidator;