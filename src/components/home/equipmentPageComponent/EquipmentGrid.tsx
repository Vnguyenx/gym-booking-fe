import React from 'react';
import EquipmentCard from '../../common/EquipmentCard';
import { Equipment } from '../../../types/models';

interface EquipmentGridProps {
    data: Equipment[];
    totalResults: number;
    selectedCategory: string;
    selectedSubCategory: string;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({
                                                         data, totalResults, selectedCategory, selectedSubCategory
                                                     }) => {
    return (
        <>
            <p className="eq-result-count">
                {totalResults} thiết bị
                {selectedCategory !== 'Tất cả' && <span> · {selectedCategory}</span>}
                {selectedSubCategory !== 'Tất cả' && <span> · {selectedSubCategory}</span>}
            </p>

            {data.length > 0 ? (
                <div className="eq-grid">
                    {data.map((item) => (
                        <EquipmentCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="eq-empty">
                    <p>Không tìm thấy thiết bị phù hợp.</p>
                </div>
            )}
        </>
    );
};

export default EquipmentGrid;