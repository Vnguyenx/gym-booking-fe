// src/hooks/pt/usePtHeader.ts
//
// Hook chứa toàn bộ logic của PtHeader:
//   - Lấy thông tin user đang đăng nhập từ Redux store
//   - Đếm số buổi đang chờ xác nhận để hiện badge đỏ trên chuông
//
// Component PtHeader.tsx chỉ nhận data từ hook này, không tự truy cập store.

import { useAppSelector } from '../store/hooks';
import { selectPendingConfirms } from '../store/selectors/ptSelectors';

// ─── Shape data trả về ────────────────────────────────────────────────────────
// Component dùng trực tiếp, không cần xử lý thêm
export interface PtHeaderData {
    /** Tên hiển thị, ví dụ: "Nguyễn Văn An" */
    displayName: string;
    /** 2-3 ký tự viết tắt để render avatar, ví dụ: "NVA" */
    avatarInitials: string;
    /** Số buổi chờ xác nhận — > 0 thì hiện badge đỏ */
    pendingCount: number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Tạo chữ viết tắt từ họ tên đầy đủ.
 * "Nguyễn Văn An" → "NVA"
 * "An"            → "AN"
 */
function getInitials(fullName: string): string {
    const words = fullName.trim().split(/\s+/);

    if (words.length === 1) {
        // Tên 1 từ: lấy 2 ký tự đầu
        return words[0].slice(0, 2).toUpperCase();
    }

    // Nhiều từ: chữ cái đầu của mỗi từ, tối đa 3
    return words
        .slice(0, 3)
        .map((w) => w[0].toUpperCase())
        .join('');
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePtHeader(): PtHeaderData {
    // TODO: Đổi 'state.auth.user' thành selector đúng của project bạn
    const user = useAppSelector((state) => (state as any).auth?.user);

    // Danh sách buổi chờ xác nhận — chỉ cần .length để tính badge
    const pendingItems = useAppSelector(selectPendingConfirms);

    const fullName: string = user?.fullName ?? user?.name ?? 'PT';

    return {
        displayName:    fullName,
        avatarInitials: getInitials(fullName),
        pendingCount:   pendingItems.length,
    };
}