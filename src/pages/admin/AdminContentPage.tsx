// src/pages/admin/AdminContentPage.tsx
import React, { useState } from 'react';
import FloorsManager from '../../components/admin/contents/FloorsManager';
import BannersManager from '../../components/admin/contents/BannersManager';
import ZonesManager from '../../components/admin/contents/ZonesManager';
import GymInfoForm from '../../components/admin/contents/GymInfoForm';
import PtInfoForm from '../../components/admin/contents/PtInfoForm';
import '../../styles/admin/AdminContentPage.css';

type Tab = 'gymInfo' | 'ptInfo' | 'banners' | 'floors' | 'zones';

const AdminContentPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('gymInfo');

    return (
        <div className="admin-content">
            <h1 className="eq-page__title" style={{ marginBottom: "24px" }} >Quản lý thông tin phòng gym</h1>
            <div className="tabs">
                <button className={activeTab === 'gymInfo' ? 'active' : ''}
                        onClick={() => setActiveTab('gymInfo')}>Thông tin phòng
                </button>
                <button className={activeTab === 'ptInfo' ? 'active' : ''} onClick={() => setActiveTab('ptInfo')}>Thông
                    tin PT
                </button>
                <button className={activeTab === 'banners' ? 'active' : ''}
                        onClick={() => setActiveTab('banners')}>Banner
                </button>
                <button className={activeTab === 'floors' ? 'active' : ''} onClick={() => setActiveTab('floors')}>Tầng
                </button>
                <button className={activeTab === 'zones' ? 'active' : ''} onClick={() => setActiveTab('zones')}>Khu
                    vực
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'gymInfo' && <GymInfoForm/>}
                {activeTab === 'ptInfo' && <PtInfoForm/>}
                {activeTab === 'banners' && <BannersManager/>}
                {activeTab === 'floors' && <FloorsManager/>}
                {activeTab === 'zones' && <ZonesManager/>}
            </div>
        </div>
    );
};

export default AdminContentPage;