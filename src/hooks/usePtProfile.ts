// src/hooks/pt/usePtProfile.ts
//
// Hook cho tab Cá nhân của PT đang đăng nhập.
//
// Thay đổi so với bản trước:
//   1. specialty: string[] thay vì string — khớp đúng PTProfileFormData trong models.ts
//   2. Tích hợp uploadImageToImgBB — PT có thể đổi avatar
//   3. avatarUrl state riêng để preview ảnh mới trước khi lưu

import { useState, useCallback, useEffect } from 'react';
import { useNavigate }                       from 'react-router-dom';
import { useAppDispatch, useAppSelector }    from '../store/hooks';
import { updatePTProfile, clearProfileStatus } from '../store/ptDashBoardSlice';
import {
    selectProfileSaving,
    selectProfileError,
    selectProfileSuccess,
} from '../store/selectors/ptSelectors';
import { PTProfileFormData } from '../types/models';
import { ROUTES }            from '../constants/routes';
import { uploadImageToImgBB } from '../services/uploadService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PtProfileInfo {
    fullName:       string;
    gender:         string;
    email:          string;
    phone:          string;
    experience:     string;
    bio:            string;
    specialties:    string[];   // string[] từ PT.specialty trong models.ts
    isAvailable:    boolean;
    avatarUrl:      string;     // URL ảnh thật (từ PT.avatar)
    avatarInitials: string;     // fallback khi không có ảnh
}

export interface PtProfileData {
    // Thông tin hiển thị
    info: PtProfileInfo;

    // Form chỉnh sửa
    isEditing:      boolean;
    formData:       PTProfileFormData;
    onFieldChange:  (field: keyof PTProfileFormData, value: string | boolean | string[]) => void;
    onEditOpen:     () => void;
    onEditCancel:   () => void;
    onEditSubmit:   () => void;

    // Upload avatar
    isUploadingAvatar: boolean;
    avatarPreview:     string;   // URL preview (có thể là blob URL tạm)
    onAvatarChange:    (file: File) => Promise<void>;

    // Trạng thái API
    isSaving:      boolean;
    saveError:     string | null;
    saveSuccess:   boolean;
    onClearStatus: () => void;

    // Logout
    onLogout: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return words.slice(0, 3).map((w) => w[0].toUpperCase()).join('');
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePtProfile(): PtProfileData {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // TODO: đổi selector đúng với auth slice của project
    const user = useAppSelector((state) => (state as any).auth?.user);

    const isSaving    = useAppSelector(selectProfileSaving);
    const saveError   = useAppSelector(selectProfileError);
    const saveSuccess = useAppSelector(selectProfileSuccess);

    // ── Info hiển thị — map từ user (khớp UserProfile + PT trong models.ts) ──
    const info: PtProfileInfo = {
        fullName:       user?.fullName    ?? user?.displayName ?? 'PT',
        gender:         user?.gender      ?? '—',
        email:          user?.email       ?? '—',
        phone:          user?.phone       ?? '—',
        experience:     user?.experience  ?? '—',
        bio:            user?.bio         ?? '',
        // PT.specialty là string[] — dùng trực tiếp, không split/join
        specialties:    Array.isArray(user?.specialty) ? user.specialty : [],
        isAvailable:    user?.isAvailable ?? false,
        avatarUrl:      user?.avatar      ?? user?.avatarUrl ?? '',
        avatarInitials: getInitials(user?.fullName ?? user?.displayName ?? 'PT'),
    };

    // ── Avatar preview — bắt đầu từ URL thật, update sau khi upload ──────────
    const [avatarPreview,      setAvatarPreview]      = useState(info.avatarUrl);
    const [isUploadingAvatar,  setIsUploadingAvatar]  = useState(false);

    // ── Form state ────────────────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData]   = useState<PTProfileFormData>({
        bio:         info.bio,
        specialty:   info.specialties,   // string[] — đúng với models.ts
        experience:  info.experience,
        isAvailable: info.isAvailable,
    });

    // Khi save thành công → tự đóng form
    useEffect(() => {
        if (saveSuccess) setIsEditing(false);
    }, [saveSuccess]);

    // ── Handlers form ─────────────────────────────────────────────────────────

    const onEditOpen = useCallback(() => {
        setFormData({
            bio:         info.bio,
            specialty:   info.specialties,
            experience:  info.experience,
            isAvailable: info.isAvailable,
        });
        setAvatarPreview(info.avatarUrl);
        dispatch(clearProfileStatus());
        setIsEditing(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info.bio, info.specialties, info.experience, info.isAvailable, info.avatarUrl, dispatch]);

    const onEditCancel = useCallback(() => {
        dispatch(clearProfileStatus());
        setIsEditing(false);
    }, [dispatch]);

    const onFieldChange = useCallback(
        (field: keyof PTProfileFormData, value: string | boolean | string[]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const onEditSubmit = useCallback(() => {
        dispatch(updatePTProfile(formData));
    }, [dispatch, formData]);

    const onClearStatus = useCallback(() => {
        dispatch(clearProfileStatus());
    }, [dispatch]);

    // ── Upload avatar ──────────────────────────────────────────────────────────
    // Flow: chọn file → preview blob URL ngay → upload lên imgBB → lưu URL thật
    const onAvatarChange = useCallback(async (file: File) => {
        // Preview ngay không cần đợi upload
        const blobUrl = URL.createObjectURL(file);
        setAvatarPreview(blobUrl);
        setIsUploadingAvatar(true);

        try {
            const uploadedUrl = await uploadImageToImgBB(file);
            if (uploadedUrl) {
                setAvatarPreview(uploadedUrl);
            } else {
                // Upload thất bại → rollback về ảnh cũ
                setAvatarPreview(info.avatarUrl);
            }
        } finally {
            setIsUploadingAvatar(false);
            // Giải phóng blob URL tránh memory leak
            URL.revokeObjectURL(blobUrl);
        }
    }, [info.avatarUrl]);

    // ── Logout ────────────────────────────────────────────────────────────────
    const onLogout = useCallback(() => {
        navigate(ROUTES.HOME, { replace: true });
    }, [navigate]);

    return {
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
        saveSuccess,
        onClearStatus,
        onLogout,
    };
}