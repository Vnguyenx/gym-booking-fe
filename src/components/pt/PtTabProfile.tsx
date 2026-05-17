// src/components/pt/PtTabProfile.tsx
// Cập nhật: truyền thêm avatarPreview, avatarInitials, isUploadingAvatar, onAvatarChange
// xuống ProfileEditForm.

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
                    isSaving={isSaving}
                    saveError={saveError}
                    avatarPreview={avatarPreview}
                    avatarInitials={info.avatarInitials}
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