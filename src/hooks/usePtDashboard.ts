// src/hooks/pt/usePtDashboard.ts
//
// Hook cho tab Dashboard của PT.
// Xử lý:
//   1. Điều hướng tháng (prev/next) — state nội bộ
//   2. Tính stats tổng hợp theo tháng từ Redux store (qua selector)
//   3. Tính danh sách session của tháng cho chart + recent list
//
// Component chỉ gọi hook này và render — không tự tính toán.

import { useState, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectDashboardStats } from '../store/selectors/ptSelectors';
import { ClassItem } from '../types/models';

// ─── ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ──────────────────────────────────────────

/** Dữ liệu cho biểu đồ cột - Hiển thị mức độ chăm chỉ của học viên */
export interface BarChartItem {
    id:          string;
    name:        string;
    sessions:    number;   // Số buổi đã tập trong tháng
    total:       number;   // Tổng số buổi trong gói (ví dụ gói 20 buổi)
    initials:    string;   // Chữ cái viết tắt (VD: "AN")
    avatarBg:    string;   // Màu nền avatar (lấy từ mảng màu cố định)
    avatarColor: string;   // Màu chữ avatar
}

/** Dữ liệu cho danh sách buổi tập gần đây */
export interface RecentSessionItem {
    id:          string;
    name:        string;
    avatarCus:   string;
    type:        string;   // "1:1" hoặc "Nhóm"
    sessions:    number;
    initials:    string;
    avatarBg:    string;
    avatarColor: string;
}

/** Cấu trúc dữ liệu trả về cuối cùng cho Component UI sử dụng */
export interface PtDashboardData {
    currentMonth:  number;
    currentYear:   number;
    monthLabel:    string;   // VD: "Tháng 05 / 2026"
    onPrevMonth:   () => void;
    onNextMonth:   () => void;
    stats: {
        activeCount:        number;
        active1on1Count:    number;
        activeGroupCount:   number;
        sessionsThisMonth:  number;
        pendingConfirmCount: number;
        expiredCount:       number;
    };
    barChartItems:      BarChartItem[];
    recentSessionItems: RecentSessionItem[];
}

// Mảng màu sắc để render Avatar cho đẹp, giống file HTML demo
const AVATAR_COLORS = [
    { bg: '#E1F5EE', color: '#085041' },
    { bg: '#E6F1FB', color: '#0C447C' },
    { bg: '#EEEDFE', color: '#3C3489' },
    { bg: '#EAF3DE', color: '#27500A' },
    { bg: '#FBEAF0', color: '#72243E' },
    { bg: '#FAEEDA', color: '#633806' },
];

// ─── HÀM TRỢ GIÚP (HELPERS) ──────────────────────────────────────────────────

/** * Lấy chữ cái đầu và cuối của tên để làm Avatar
 * VD: "Nguyễn Văn Anh" -> "NA"
 */
function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length <= 1) return name.slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** * Đếm xem trong 1 lớp học, có bao nhiêu buổi tập thành công trong tháng/năm cụ thể
 */
function countSessionsInMonth(cls: ClassItem, month: number, year: number): number {
    return cls.attendance.filter((a) => {
        if (!a.isSuccess || !a.date) return false;
        const d = new Date(a.date);
        // Kiểm tra khớp tháng và năm
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    }).length;
}

// ─── HOOK CHÍNH ──────────────────────────────────────────────────────────────

export function usePtDashboard(): PtDashboardData {
    // 1. Quản lý trạng thái Tháng/Năm đang xem (Mặc định là hiện tại)
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year,  setYear]  = useState(now.getFullYear());

    // Hàm lùi 1 tháng
    const onPrevMonth = () => {
        if (month === 1) { setMonth(12); setYear((y) => y - 1); }
        else             { setMonth((m) => m - 1); }
    };

    // Hàm tiến 1 tháng
    const onNextMonth = () => {
        if (month === 12) { setMonth(1); setYear((y) => y + 1); }
        else              { setMonth((m) => m + 1); }
    };

    // 2. Lấy dữ liệu từ Redux Store
    // Stats (con số tổng) được tính toán qua Selector để tối ưu hiệu năng
    const stats = useAppSelector((state) => selectDashboardStats(state, month, year));
    // Lấy danh sách lớp học đang dạy
    const activeClasses = useAppSelector((state) => state.ptDashboard.activeClasses);

    // 3. Xử lý dữ liệu thô thành dữ liệu hiển thị (Chart & List)
    // Dùng useMemo để chỉ tính toán lại khi danh sách lớp hoặc tháng/năm thay đổi
    const { barChartItems, recentSessionItems } = useMemo(() => {

        // Bước A: Duyệt qua từng lớp, tính toán số buổi và chuẩn bị thông tin "đầy đủ"
        const processedItems = activeClasses.map((cls, idx) => {
            const colorPair = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const sessions  = countSessionsInMonth(cls, month, year);
            const name = (cls as any).customerName || cls.customerId; // fallback nếu data cũ


            return {
                id:          cls.id,
                name,
                sessions,
                total: cls.totalSessions || 20,
                type: cls.type === 'pt-1on1' ? '1:1' : 'Nhóm',
                initials:    getInitials(name),
                avatarCus: cls.customerAvatar,
                avatarBg:    colorPair.bg,
                avatarColor: colorPair.color,
            };
        });

        // Bước B: Chỉ lấy những người có đi tập trong tháng này và sắp xếp ai tập nhiều lên trước
        const sorted = processedItems
            .filter((i) => i.sessions > 0)
            .sort((a, b) => b.sessions - a.sessions);

        // Bước C: Tách ra 2 mảng riêng biệt khớp với định dạng Interface yêu cầu (Clean data)
        const chartData: BarChartItem[] = sorted.slice(0, 6).map(item => ({
            id: item.id,
            name: item.name,
            sessions: item.sessions,
            total: item.total,
            initials: item.initials,
            avatarBg: item.avatarBg,
            avatarColor: item.avatarColor
        }));

        const recentData: RecentSessionItem[] = sorted.slice(0, 6).map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            sessions: item.sessions,
            initials: item.initials,
            avatarCus: item.avatarCus,
            avatarBg: item.avatarBg,
            avatarColor: item.avatarColor
        }));

        return {
            barChartItems: chartData,
            recentSessionItems: recentData,
        };
    }, [activeClasses, month, year]);

    // Trả về "thành phẩm" cho UI. UI chỉ việc lôi ra hiển thị, không cần tính toán gì thêm.
    return {
        currentMonth: month,
        currentYear:  year,
        monthLabel:   `Tháng ${month < 10 ? '0' + month : month} / ${year}`,
        onPrevMonth,
        onNextMonth,
        stats,
        barChartItems,
        recentSessionItems,
    };
}