// src/components/pt/PtTabProfile.tsx
// Cập nhật: truyền info xuống ProfileEditForm cho read-only fields

import React from 'react';
import { usePtProfile }  from '../../hooks/usePtProfile';
import ProfileInfoView   from './profile/ProfileInfoView';
import ProfileEditForm   from './profile/ProfileEditForm';

const PtTabProfile: React.FC = () => {
    const {
        info,
        isEditing,
        formData,
        onFieldChange,
        onEditOpen,
        onEditCancel,
        onEditSubmit,
        isUploadingAvatar,
        avatarPreview,
        onAvatarChange,
        isSaving,
        saveError,
        onClearStatus,
        onLogout,
    } = usePtProfile();

    return (
        <div className="pt-tab-profile">
            {isEditing ? (
                <ProfileEditForm
                    formData={formData}
                    info={info}                         // ← thêm để hiện read-only
                    isSaving={isSaving}
                    saveError={saveError}
                    avatarPreview={avatarPreview}
                    isUploadingAvatar={isUploadingAvatar}
                    onAvatarChange={onAvatarChange}
                    onFieldChange={onFieldChange}
                    onSubmit={onEditSubmit}
                    onCancel={onEditCancel}
                    onClearError={onClearStatus}
                />
            ) : (
                <ProfileInfoView
                    info={info}
                    onEditOpen={onEditOpen}
                    onLogout={onLogout}
                />
            )}
        </div>
    );
};

export default PtTabProfile;