// constants/roles.ts
// Định nghĩa các role (phân quyền) trong hệ thống
// Dùng as const để TypeScript hiểu đây là giá trị cố định,
// tránh gõ sai tên role trong code

export const ROLES = {
    CUSTOMER: 'customer', // Khách hàng
    PT: 'pt',             // Huấn luyện viên / Giảng viên
    ADMIN: 'admin',       // Chủ phòng gym
} as const;

// Role là kiểu union: 'customer' | 'pt' | 'admin'
export type Role = typeof ROLES[keyof typeof ROLES];