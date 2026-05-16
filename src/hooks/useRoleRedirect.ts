// src/hooks/useRoleRedirect.ts
//
// Hook trả về đường dẫn dashboard tương ứng với role của user.
// Dùng sau khi login thành công để redirect đúng trang.
//
// Cách dùng trong LoginPage:
//   const getDashboardPath = useRoleRedirect();
//   ...sau khi login thành công...
//   navigate(getDashboardPath(user.role));

import { ROUTES } from '../constants/routes';
import { Role }   from '../constants/roles';

// Map role → đường dẫn dashboard tương ứng
const ROLE_DASHBOARD_MAP: Record<Role, string> = {
    pt:       ROUTES.PT_DASHBOARD,
    admin:    ROUTES.ADMIN_DASHBOARD,
    customer: ROUTES.MY_PROFILE,   // customer không có dashboard riêng → về profile
};

/**
 * Nhận role string, trả về path dashboard.
 * Nếu role không hợp lệ → về trang chủ.
 */
export function getRoleHomePath(role: string | undefined): string {
    if (!role) return ROUTES.HOME;
    return ROLE_DASHBOARD_MAP[role as Role] ?? ROUTES.HOME;
}