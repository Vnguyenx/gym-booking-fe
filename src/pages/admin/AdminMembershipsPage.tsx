// src/pages/admin/AdminMembershipsPage.tsx
import React, { useState } from 'react';

// ── Sub-components ────────────────────────────────────────────────────────────
import MembershipCard from '../../components/admin/catalog/MembershipCard';
import MembershipFormModal from '../../components/admin/catalog/MembershipFormModal';
import PTServiceCard from '../../components/admin/catalog/PTServiceCard';
import PTServiceFormModal from '../../components/admin/catalog/PTServiceFormModal';
import {
    SectionHeader,
    EmptyState,
    LoadingGrid,
    ErrorBanner,
    DeleteConfirmModal,
} from '../../components/admin/catalog/CatalogShared';
import '../../styles/admin/AdminCatolog.css';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useAdminMemberships } from '../../hooks/useAdminMemberships';
import { useAdminPTServices } from '../../hooks/useAdminPTServices';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type TabKey = 'memberships' | 'pt-services';

const MembershipsSection: React.FC = () => {
    const {
        memberships, isLoading, error,
        editingItem, formData, openCreateModal, openEditModal, closeModal,
        updateField, handleSubmit,
        deletingId, setDeletingId, handleDeleteConfirm,
    } = useAdminMemberships();

    const deletingName = memberships.find((m) => m.id === deletingId)?.name;

    return (
        <div className="catalog-section">
            <SectionHeader
                title="Gói tập"
                subtitle="Quản lý các gói thành viên phòng gym"
                onAdd={openCreateModal}
                addLabel="Thêm gói tập"
            />
            {error && <ErrorBanner message={error} />}
            {isLoading && memberships.length === 0 ? (
                <LoadingGrid count={4} />
            ) : memberships.length === 0 ? (
                <EmptyState icon="🏋️" message="Chưa có gói tập nào." onAdd={openCreateModal} />
            ) : (
                <div className="catalog-grid">
                    {memberships.map((item) => (
                        <MembershipCard key={item.id} item={item} onEdit={openEditModal} onDelete={setDeletingId} />
                    ))}
                </div>
            )}
            <MembershipFormModal
                isOpen={editingItem !== null}
                isEditing={editingItem !== 'new'}
                formData={formData}
                isLoading={isLoading}
                onClose={closeModal}
                onSubmit={handleSubmit}
                updateField={updateField}
            />
            <DeleteConfirmModal
                isOpen={deletingId !== null}
                itemName={deletingName}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingId(null)}
                isLoading={isLoading}
            />
        </div>
    );
};

const PTServicesSection: React.FC = () => {
    const {
        ptServices, isLoading, error,
        editingItem, formData, openCreateModal, openEditModal, closeModal,
        updateField, handleSubmit,
        deletingId, setDeletingId, handleDeleteConfirm,
    } = useAdminPTServices();

    const deletingName = ptServices.find((s) => s.id === deletingId)?.name;

    return (
        <div className="catalog-section">
            <SectionHeader
                title="Dịch vụ PT"
                subtitle="Quản lý các gói huấn luyện cá nhân"
                onAdd={openCreateModal}
                addLabel="Thêm dịch vụ PT"
            />
            {error && <ErrorBanner message={error} />}
            {isLoading && ptServices.length === 0 ? (
                <LoadingGrid count={3} />
            ) : ptServices.length === 0 ? (
                <EmptyState icon="💪" message="Chưa có dịch vụ PT nào." onAdd={openCreateModal} />
            ) : (
                <div className="catalog-grid">
                    {ptServices.map((item) => (
                        <PTServiceCard key={item.id} item={item} onEdit={openEditModal} onDelete={setDeletingId} />
                    ))}
                </div>
            )}
            <PTServiceFormModal
                isOpen={editingItem !== null}
                isEditing={editingItem !== 'new'}
                formData={formData}
                isLoading={isLoading}
                onClose={closeModal}
                onSubmit={handleSubmit}
                updateField={updateField}
            />
            <DeleteConfirmModal
                isOpen={deletingId !== null}
                itemName={deletingName}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingId(null)}
                isLoading={isLoading}
            />
        </div>
    );
};

const TabBar: React.FC<{ active: TabKey; onChange: (tab: TabKey) => void }> = ({ active, onChange }) => {
    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: 'memberships', label: 'Gói tập', icon: '🏋️' },
        { key: 'pt-services', label: 'Dịch vụ PT', icon: '💪' },
    ];
    return (
        <div className="catalog-tab-bar">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`catalog-tab-btn ${active === tab.key ? 'catalog-tab-btn--active' : ''}`}
                    onClick={() => onChange(tab.key)}
                >
                    <span className="catalog-tab-icon">{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

const AdminMembershipsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('memberships');
    return (
        <div className="catalog-page">
            <div className="catalog-container">
                <div className="catalog-header">
                    <h1 className="catalog-header__title">Quản lý dịch vụ</h1>
                    <p className="catalog-header__subtitle">Gói tập và dịch vụ huấn luyện cá nhân</p>
                </div>
                <TabBar active={activeTab} onChange={setActiveTab} />
                {activeTab === 'memberships' ? <MembershipsSection key="memberships" /> : <PTServicesSection key="pt-services" />}
            </div>
        </div>
    );
};

export default AdminMembershipsPage;