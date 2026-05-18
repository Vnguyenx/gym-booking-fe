// src/hooks/pt/usePtProfile.ts
//
// Thay đổi: dùng usePtProfileData thay vì (state as any).auth?.user
// → merge đúng auth + ptProfile từ 2 slice

import { useState, useCallback, useEffect } from 'react';
import { useNavigate }                       from 'react-router-dom';
import { useAppDispatch, useAppSelector }    from '../store/hooks';
import { updatePTProfile, clearProfileStatus } from '../store/ptDashBoardSlice';
import { updatePtProfileInStore }            from '../store/ptProfileSlice';
import { logout }                            from '../store/authSlice';
import {
    selectProfileSaving,
    selectProfileError,
    selectProfileSuccess,
} from '../store/selectors/ptSelectors';
import { usePtProfileData }  from './usePtProfileData';
import { PTProfileFormData } from '../types/models';
import { ROUTES }            from '../constants/routes';
import { uploadImageToImgBB } from '../services/uploadService';
import { authService }        from '../services/authService';

// ─── Types export ────────────────────────────────────────────────────────────

export interface PtProfileInfo {
    fullName:       string;
    gender:         string;
    email:          string;
    phone:          string;
    experience:     string;
    bio:            string;
    specialties:    string[];
    isAvailable:    boolean;
    avatarUrl:      string;
    avatarInitials: string;
}

export interface PtProfileData {
    info:              PtProfileInfo;
    isEditing:         boolean;
    formData:          PTProfileFormData;
    onFieldChange:     (field: keyof PTProfileFormData, value: string | boolean | string[]) => void;
    onEditOpen:        () => void;
    onEditCancel:      () => void;
    onEditSubmit:      () => void;
    isUploadingAvatar: boolean;
    avatarPreview:     string;
    onAvatarChange:    (file: File) => Promise<void>;
    isSaving:          boolean;
    saveError:         string | null;
    saveSuccess:       boolean;
    onClearStatus:     () => void;
    onLogout:          () => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return words.slice(0, 3).map((w) => w[0].toUpperCase()).join('');
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePtProfile(): PtProfileData {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Dùng hook merge — không còn (state as any).auth?.user
    const { ptUser } = usePtProfileData();

    const isSaving    = useAppSelector(selectProfileSaving);
    const saveError   = useAppSelector(selectProfileError);
    const saveSuccess = useAppSelector(selectProfileSuccess);

    // Map sang PtProfileInfo
    const info: PtProfileInfo = {
        fullName:       ptUser?.fullName    ?? ptUser?.displayName ?? 'PT',
        gender:         ptUser?.gender      ?? '—',
        email:          ptUser?.email       ?? '—',
        phone:          ptUser?.phone       ?? '—',
        experience:     ptUser?.experience  ?? '—',
        bio:            ptUser?.bio         ?? '',
        specialties:    ptUser?.specialty   ?? [],
        isAvailable:    ptUser?.isAvailable ?? false,
        avatarUrl:      ptUser?.avatar      ?? '',
        avatarInitials: getInitials(ptUser?.fullName ?? ptUser?.displayName ?? 'PT'),
    };

    const [isEditing,         setIsEditing]         = useState(false);
    const [avatarPreview,     setAvatarPreview]      = useState(info.avatarUrl);
    const [isUploadingAvatar, setIsUploadingAvatar]  = useState(false);
    const [formData,          setFormData]           = useState<PTProfileFormData>({
        bio:         info.bio,
        specialty:   info.specialties,
        experience:  info.experience,
        isAvailable: info.isAvailable,
    });

    // Tự đóng form khi save thành công
    useEffect(() => {
        if (saveSuccess) setIsEditing(false);
    }, [saveSuccess]);

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
        // Sau khi BE xác nhận, sync lại ptProfileSlice để UI reflect ngay
        dispatch(updatePtProfileInStore({
            bio:         formData.bio,
            specialty:   formData.specialty,
            experience:  formData.experience,
            isAvailable: formData.isAvailable,
        }));
    }, [dispatch, formData]);

    const onClearStatus = useCallback(() => {
        dispatch(clearProfileStatus());
    }, [dispatch]);

    // Upload avatar → imgBB → sync store
    const onAvatarChange = useCallback(async (file: File) => {
        const blobUrl = URL.createObjectURL(file);
        setAvatarPreview(blobUrl);
        setIsUploadingAvatar(true);

        try {
            const uploadedUrl = await uploadImageToImgBB(file);
            if (uploadedUrl) {
                setAvatarPreview(uploadedUrl);
                // Sync URL mới vào ptProfileSlice
                dispatch(updatePtProfileInStore({ avatar: uploadedUrl }));
            } else {
                setAvatarPreview(info.avatarUrl); // rollback
            }
        } finally {
            setIsUploadingAvatar(false);
            URL.revokeObjectURL(blobUrl);
        }
    }, [dispatch, info.avatarUrl]);

    // Logout: gọi authService xoá cookie → dispatch logout action → về HOME
    const onLogout = useCallback(async () => {
        await authService.logout();
        dispatch(logout());
        navigate(ROUTES.HOME, { replace: true });
    }, [dispatch, navigate]);

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