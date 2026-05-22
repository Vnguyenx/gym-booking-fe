// src/components/admin/catalog/CatalogShared.tsx
import React from 'react';

export const formatVND = (value: number): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onAdd: () => void;
    addLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onAdd, addLabel = 'Thêm mới' }) => (
    <div className="catalog-section-header">
        <div>
            <h2 className="catalog-section-header__title">{title}</h2>
            {subtitle && <p className="catalog-section-header__subtitle">{subtitle}</p>}
        </div>
        <button className="catalog-section-header__button" onClick={onAdd}>
            <svg className="catalog-icon-plus" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="catalog-section-header__button-text">{addLabel}</span>
        </button>
    </div>
);

interface EmptyStateProps {
    icon?: React.ReactNode;
    message?: string;
    onAdd?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, message = 'Chưa có dữ liệu.', onAdd }) => (
    <div className="catalog-empty-state">
        <div className="catalog-empty-state__icon">{icon ?? '📂'}</div>
        <p className="catalog-empty-state__message">{message}</p>
        {onAdd && (
            <button className="catalog-empty-state__button" onClick={onAdd}>
                Tạo ngay
            </button>
        )}
    </div>
);

export const LoadingGrid: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <div className="catalog-grid">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="catalog-skeleton" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
    </div>
);

interface ErrorBannerProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => (
    <div className="catalog-error-banner">
        <span className="catalog-error-banner__icon">⚠️</span>
        <span className="catalog-error-banner__message">{message}</span>
        {onDismiss && (
            <button className="catalog-error-banner__close" onClick={onDismiss} aria-label="Đóng">
                ✕
            </button>
        )}
    </div>
);

interface DeleteConfirmModalProps {
    isOpen: boolean;
    itemName?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
                                                                          isOpen,
                                                                          itemName,
                                                                          onConfirm,
                                                                          onCancel,
                                                                          isLoading,
                                                                      }) => {
    if (!isOpen) return null;
    return (
        <div className="catalog-modal-overlay" onClick={onCancel}>
            <div className="catalog-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="catalog-confirm-modal__icon">🗑️</div>
                <h3 className="catalog-confirm-modal__title">Xác nhận xoá</h3>
                <p className="catalog-confirm-modal__message">
                    {itemName
                        ? `Bạn có chắc muốn xoá "${itemName}" không? Hành động này không thể hoàn tác.`
                        : 'Bạn có chắc muốn xoá mục này?'}
                </p>
                <div className="catalog-confirm-modal__actions">
                    <button className="catalog-btn catalog-btn--secondary" onClick={onCancel}>
                        Huỷ
                    </button>
                    <button className="catalog-btn catalog-btn--danger" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Đang xoá...' : 'Xoá'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FormModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
    submitLabel?: string;
    children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
                                                        isOpen,
                                                        title,
                                                        onClose,
                                                        onSubmit,
                                                        isLoading,
                                                        submitLabel = 'Lưu',
                                                        children,
                                                    }) => {
    if (!isOpen) return null;
    return (
        <div className="catalog-modal-overlay" onClick={onClose}>
            <div className="catalog-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="catalog-form-modal__header">
                    <h3 className="catalog-form-modal__title">{title}</h3>
                    <button className="catalog-form-modal__close" onClick={onClose} aria-label="Đóng">
                        ✕
                    </button>
                </div>
                <div className="catalog-form-modal__body">{children}</div>
                <div className="catalog-form-modal__footer">
                    <button className="catalog-btn catalog-btn--secondary" onClick={onClose}>
                        Huỷ
                    </button>
                    <button className="catalog-btn catalog-btn--primary" onClick={onSubmit} disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, children, hint }) => (
    <div className="catalog-form-field">
        <label className="catalog-form-field__label">
            {label}
            {required && <span className="catalog-form-field__required"> *</span>}
        </label>
        {children}
        {hint && <p className="catalog-form-field__hint">{hint}</p>}
    </div>
);

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="catalog-form-input" />
);

export const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="catalog-form-textarea" />
);