import React from 'react';
import PTCard from '../../common/PTCard';
import { PT } from '../../../types/models';

interface PTGridProps {
    data: PT[];
    totalResults: number;
    selectedGender: string;
}

const PTGrid: React.FC<PTGridProps> = ({ data, totalResults, selectedGender }) => {
    return (
        <>
            <p className="pt-result-count">
                Tìm thấy {totalResults} Huấn luyện viên
                {selectedGender !== 'Tất cả' && <span> · Giới tính: {selectedGender}</span>}
            </p>

            {data.length > 0 ? (
                <div className="pt-grid">
                    {data.map((item) => (
                        <PTCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="pt-empty">
                    <p>Không tìm thấy Huấn luyện viên nào phù hợp với bộ lọc.</p>
                </div>
            )}
        </>
    );
};

export default PTGrid;