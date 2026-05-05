import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PTBanner from '../../components/home/pt/PTBanner';
import PTFilterBar from '../../components/home/pt/PTFilterBar';
import PTGrid from '../../components/home/pt/PTGrid';
import PTPagination from '../../components/home/pt/PTPagination';
import { usePTData } from '../../hooks/usePTData'; // Hook lấy data từ Firestore bảng 'pts'
import { usePTFilter } from '../../hooks/usePTFilter';
import '../../styles/pages/pt-page.css';

const PTPage: React.FC = () => {
    const { pts, loading } = usePTData(); // Giả định bạn đã có hook lấy data
    const filter = usePTFilter(pts);

    if (loading) return <div className="loading">Đang tải đội ngũ PT...</div>;

    return (
        <div className="pt-page">
            <Navbar />
            <PTBanner />
            <PTFilterBar
                searchTerm={filter.searchTerm}
                setSearchTerm={filter.setSearchTerm}
                genders={filter.genders}
                selectedGender={filter.selectedGender}
                setSelectedGender={filter.setSelectedGender}
            />
            <main className="container py-10">
                <PTGrid data={filter.currentData}
                        totalResults={filter.totalResults}
                        selectedGender={filter.selectedGender}
                />
                <PTPagination
                    currentPage={filter.currentPage}
                    totalPages={filter.totalPages}
                    setCurrentPage={filter.setCurrentPage}
                />
            </main>
            <Footer />
        </div>
    );
};

export default PTPage;