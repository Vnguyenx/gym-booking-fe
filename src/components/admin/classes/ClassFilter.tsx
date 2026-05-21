// src/components/admin/classes/ClassFilter.tsx
import React, { useState } from 'react';

interface Props {
    onFilter: (filters: { status: string; search: string }) => void;
}

const ClassFilter: React.FC<Props> = ({ onFilter }) => {
    const [status, setStatus] = useState('active');
    const [search, setSearch] = useState('');

    const handleApply = () => {
        onFilter({ status, search });
    };

    // Gõ tên → filter ngay, không cần nhấn nút
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        onFilter({ status, search: val });
    };

    return (
        <div className="filter-container">
            <div className="filter-group">
                <label>Trạng thái</label>
                <select
                    className="filter-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="active">Đang tập</option>
                    <option value="expired">Đã kết thúc</option>
                </select>
            </div>
            <div className="filter-group">
                <label>Tìm theo tên học viên / PT</label>
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Ví dụ: Nguyễn Văn A..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>
            <button
                className="btn-primary"
                onClick={handleApply}
            >
                Lọc
            </button>
        </div>
    );
};

export default ClassFilter;