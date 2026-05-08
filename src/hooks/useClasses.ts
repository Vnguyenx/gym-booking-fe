import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
    date: string;         // VD: "2025-05-01"
    status: AttendanceStatus;
    note?: string;
}

export interface ClassItem {
    id: string;
    className: string;    // Tên lớp học
    courseName: string;   // Tên khoá học (nếu có)
    instructor: string;   // Tên giáo viên
    schedule: string;     // VD: "Thứ 2, 4, 6 - 18:00"
    isEnrolled: boolean;  // Có đăng ký khoá học không
    attendance: AttendanceRecord[];
}

export interface UseClassesReturn {
    classes: ClassItem[];
    isLoading: boolean;
    selectedClassId: string | null;
    selectedClass: ClassItem | undefined;
    selectClass: (id: string) => void;
    clearSelection: () => void;
}

// ─── Dữ liệu giả (mock data) ─────────────────────────────────────────────────
// TODO: Thay bằng API call thật khi backend sẵn sàng

const MOCK_CLASSES: ClassItem[] = [
    {
        id: 'cls-001',
        className: 'Yoga Buổi Sáng - Nhóm A',
        courseName: 'Khoá Yoga Cơ Bản 3 Tháng',
        instructor: 'Cô Minh Tâm',
        schedule: 'Thứ 2, 4, 6 – 06:30',
        isEnrolled: true,
        attendance: [
            { date: '2025-05-01', status: 'present' },
            { date: '2025-05-03', status: 'present' },
            { date: '2025-05-06', status: 'late', note: 'Đến trễ 10 phút' },
            { date: '2025-05-08', status: 'absent', note: 'Vắng có phép' },
            { date: '2025-05-10', status: 'present' },
        ],
    },
    {
        id: 'cls-002',
        className: 'Pilates Tổng Hợp',
        courseName: '', // Không đăng ký khoá học cụ thể, chỉ điểm danh lẻ
        instructor: 'Thầy Hoàng Nam',
        schedule: 'Thứ 3, 5 – 19:00',
        isEnrolled: false,
        attendance: [
            { date: '2025-05-02', status: 'present' },
            { date: '2025-05-07', status: 'absent' },
        ],
    },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useClasses
 * Quản lý danh sách lớp học và điểm danh của customer.
 * Hỗ trợ cả trường hợp có và không có đăng ký khoá học.
 */
const useClasses = (): UseClassesReturn => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    // Giả lập gọi API lấy danh sách lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                // TODO: Thay bằng API call thật
                // const data = await classService.getMyClasses();
                // setClasses(data);

                // Giả lập delay network
                await new Promise((resolve) => setTimeout(resolve, 600));
                setClasses(MOCK_CLASSES);
            } catch (error) {
                console.error('Lỗi tải danh sách lớp học:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const selectedClass = classes.find((c) => c.id === selectedClassId);

    const selectClass = (id: string) => setSelectedClassId(id);
    const clearSelection = () => setSelectedClassId(null);

    return {
        classes,
        isLoading,
        selectedClassId,
        selectedClass,
        selectClass,
        clearSelection,
    };
};

export default useClasses;