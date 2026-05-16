// src/components/pt/students/FilterChips.tsx
//
// Sub-component: dải chip filter ngang — All | 1:1 | Nhóm | Hết hạn
// Chip active nền orange, còn lại nền surface với viền.

import React from 'react';
import { StudentFilter } from '../../../types/models';

// ─── Định nghĩa các chip ──────────────────────────────────────────────────────

interface ChipConfig {
    key:   StudentFilter;
    label: string;
}

const CHIPS: ChipConfig[] = [
    { key: 'all',     label: 'Tất cả'   },
    { key: '1on1',    label: '1:1'      },
    { key: 'group',   label: 'Nhóm'     },
    { key: 'expired', label: 'Hết hạn'  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FilterChipsProps {
    activeFilter:   StudentFilter;
    onFilterChange: (f: StudentFilter) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const FilterChips: React.FC<FilterChipsProps> = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="filter-chips" role="group" aria-label="Lọc học viên">
            {CHIPS.map((chip) => (
                <button
                    key={chip.key}
                    className={`filter-chips__btn ${activeFilter === chip.key ? 'filter-chips__btn--active' : ''}`}
                    onClick={() => onFilterChange(chip.key)}
                    aria-pressed={activeFilter === chip.key}
                >
                    {chip.label}
                </button>
            ))}
        </div>
    );
};

export default FilterChips;