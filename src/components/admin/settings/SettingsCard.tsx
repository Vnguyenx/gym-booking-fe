// src/components/admin/SettingsCard.tsx
/**
 * Card bọc nội dung cài đặt, có tiêu đề và nút lưu/hủy
 */

import React, { ReactNode } from 'react';
interface SettingsCardProps {
    title: string;
    loading?: boolean;
    error?: string | null;
    isDirty?: boolean;      // có thay đổi chưa
    onSave: () => void;
    onCancel?: () => void;
    children: ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
                                                       title,
                                                       loading,
                                                       error,
                                                       isDirty = false,
                                                       onSave,
                                                       onCancel,
                                                       children,
                                                   }) => {
    return (
        <div className="settings-card">
            <h2 className="settings-card__title">{title}</h2>
            <div className="settings-card__body">{children}</div>

            {error && <div className="settings-card__error">{error}</div>}

            <div className="settings-card__actions">
                {onCancel && (
                    <button
                        className="settings-card__btn settings-card__btn--secondary"
                        onClick={onCancel}
                        disabled={loading || !isDirty}
                    >
                        Hủy
                    </button>
                )}
                <button
                    className="settings-card__btn settings-card__btn--primary"
                    onClick={onSave}
                    disabled={loading || !isDirty}
                >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>
        </div>
    );
};

export default SettingsCard;