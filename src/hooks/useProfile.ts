import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
// import { updateProfile } from '../../../store/slices/authSlice'; // Uncomment khi có API thật

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProfileFormData {
    displayName: string;
    phone: string;
    email: string; // email chỉ hiển thị, không cho sửa
}

export interface UseProfileReturn {
    formData: ProfileFormData;
    isEditing: boolean;
    isSaving: boolean;
    successMessage: string;
    errorMessage: string;
    handleEdit: () => void;
    handleCancel: () => void;
    handleChange: (field: keyof ProfileFormData, value: string) => void;
    handleSave: () => Promise<void>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useProfile
 * Quản lý logic xem và chỉnh sửa thông tin cá nhân của user.
 * Tách biệt hoàn toàn với UI để dễ test và tái sử dụng.
 */
const useProfile = (): UseProfileReturn => {
    const dispatch = useAppDispatch();

    // Lấy thông tin user từ Redux store
     const user = useAppSelector((state) => state.auth.user);



    // State cho form chỉnh sửa
    const [formData, setFormData] = useState<ProfileFormData>({
        displayName: user?.displayName ?? '',
        phone: user?.phone ?? '',
        email: user?.email ?? '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Bật chế độ chỉnh sửa
    const handleEdit = () => {
        setIsEditing(true);
        setSuccessMessage('');
        setErrorMessage('');
    };

    // Huỷ chỉnh sửa, khôi phục dữ liệu gốc
    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName ?? '',
            phone: user?.phone ?? '',
            email: user?.email ?? '',
        });
        setIsEditing(false);
        setErrorMessage('');
    };

    // Cập nhật giá trị một field trong form
    const handleChange = (field: keyof ProfileFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Lưu thông tin - gọi API rồi cập nhật Redux
    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage('');

        try {
            // TODO: Thay bằng dispatch(updateProfile(formData)) khi có API thật
            // await dispatch(updateProfile(formData)).unwrap();

            // Giả lập gọi API mất 1 giây
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSuccessMessage('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            setErrorMessage('Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        isEditing,
        isSaving,
        successMessage,
        errorMessage,
        handleEdit,
        handleCancel,
        handleChange,
        handleSave,
    };
};

export default useProfile;