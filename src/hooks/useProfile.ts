import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserInStore } from '../store/slices/authSlice';
import { customerService } from '../services/customerService';
import { ProfileFormData, UseProfileReturn } from '../types/models';

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * useProfile
 * Quản lý logic xem và chỉnh sửa thông tin cá nhân của user.
 * Tách biệt hoàn toàn với UI để dễ test và tái sử dụng.
 *
 * Luồng avatar: FE upload ImgBB → lấy URL → handleAvatarSave(url) → gọi API BE
 * Luồng profile: handleSave() → gọi API BE → cập nhật Redux store
 */
const useProfile = (): UseProfileReturn => {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);

    // ── Form state ────────────────────────────────────────
    const [formData, setFormData] = useState<ProfileFormData>({
        displayName: user?.displayName ?? '',
        phone:       user?.phone       ?? '',
        email:       user?.email       ?? '',
    });

    const [isEditing,      setIsEditing]      = useState(false);
    const [isSaving,       setIsSaving]       = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage,   setErrorMessage]   = useState('');

    // ── Avatar state ──────────────────────────────────────
    const [avatarUrl,         setAvatarUrl]         = useState(user?.avatarUrl ?? '');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // ── Handlers form ─────────────────────────────────────

    const handleEdit = () => {
        setIsEditing(true);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName ?? '',
            phone:       user?.phone       ?? '',
            email:       user?.email       ?? '',
        });
        setIsEditing(false);
        setErrorMessage('');
    };

    const handleChange = (field: keyof ProfileFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage('');
        try {
            await customerService.updateProfile({
                displayName: formData.displayName,
                phone:       formData.phone,
                avatarUrl,
            });
            dispatch(updateUserInStore({
                displayName: formData.displayName,
                phone:       formData.phone,
            }));
            setSuccessMessage('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error: any) {
            setErrorMessage(error.message ?? 'Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Handler avatar ────────────────────────────────────

    const handleAvatarSave = async (url: string) => {
        setIsUploadingAvatar(true);
        try {
            await customerService.updateProfile({
                displayName: formData.displayName,
                phone:       formData.phone,
                avatarUrl:   url,
            });
            setAvatarUrl(url);
            dispatch(updateUserInStore({ avatarUrl: url }));
        } catch (error: any) {
            throw new Error(error.message ?? 'Không thể lưu ảnh đại diện.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // ── Return ────────────────────────────────────────────

    return {
        formData,
        isEditing,
        isSaving,
        successMessage,
        errorMessage,
        avatarUrl,
        isUploadingAvatar,
        handleEdit,
        handleCancel,
        handleChange,
        handleSave,
        handleAvatarSave,
    };
};

export default useProfile;