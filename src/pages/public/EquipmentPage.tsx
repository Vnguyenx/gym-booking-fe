import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import useEquipmentData from '../../hooks/useEquipmentData';
import { useEquipmentFilter } from '../../hooks/useEquipmentFilter';

// Import các component mới tách
import EquipmentBanner from '../../components/home/equipmentPageComponent/EquipmentBanner';
import EquipmentFilterBar from '../../components/home/equipmentPageComponent/EquipmentFilterBar';
import EquipmentGrid from '../../components/home/equipmentPageComponent/EquipmentGrid';
import EquipmentPagination from '../../components/home/equipmentPageComponent/EquipmentPagination';

import '../../styles/pages/equipment-page.css';

const EquipmentPage: React.FC = () => {
    const { equipment, loading } = useEquipmentData();
    const {
        searchTerm, setSearchTerm,
        categories, selectedCategory, setSelectedCategory,
        subCategories, selectedSubCategory, setSelectedSubCategory,
        currentPage, setCurrentPage,
        totalPages, currentData, totalResults,
    } = useEquipmentFilter(equipment);

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div className="equipment-page">
            <Navbar />

            <EquipmentBanner />

            <EquipmentFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                subCategories={subCategories}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
            />

            <main className="container py-10">
                <EquipmentGrid
                    data={currentData}
                    totalResults={totalResults}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                />

                <EquipmentPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </main>

            <Footer />
        </div>
    );
};

export default EquipmentPage;