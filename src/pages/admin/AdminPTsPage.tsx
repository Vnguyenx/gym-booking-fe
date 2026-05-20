// src/pages/admin/AdminPTsPage.tsx
import React, { useState } from 'react';
import PTList from '../../components/admin/pts/PTList';
import PTApplications from '../../components/admin/pts/PTApplications';
import '../../styles/admin/AdminPtsPage.css';

const AdminPTsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pts' | 'applications'>('pts');

    return (
        <div className="au-page">
            <div className="au-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="au-title">Hồ sơ PT & Đơn đăng ký</h1>

                <div className="au-tabs" style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className={`au-btn ${activeTab === 'pts' ? 'au-btn--primary' : 'au-btn--ghost'}`}
                        onClick={() => setActiveTab('pts')}
                    >
                        Hồ sơ PT
                    </button>
                    <button
                        className={`au-btn ${activeTab === 'applications' ? 'au-btn--primary' : 'au-btn--ghost'}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Xét duyệt đơn
                    </button>
                </div>
            </div>

            {/* Render component theo Tab đang active */}
            {activeTab === 'pts' ? <PTList /> : <PTApplications />}
        </div>
    );
};

export default AdminPTsPage;