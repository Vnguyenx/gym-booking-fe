import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
    fetchEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    clearError,
} from '../store/admin/adminEquipmentSlice';
import { getFloors, getZones } from '../store/admin/adminOptionsSlice';
import { uploadImageToImgBB } from '../services/uploadService';
import { Equipment } from '../types/models';

export type EquipmentFormData = Omit<Equipment, 'id' | 'updatedAt'>;

const EMPTY_FORM: EquipmentFormData = {
    name: '',
    nameVi: '',
    description: '',
    category: '',
    subCategory: '',
    floorId: '',
    gymId: 'main-gym',
    zoneId: '',
    imageUrls: [],
    isActive: true,
    quantity: 1,
    muscleGroups: [],
    tips: '',
};

type ModalMode = 'closed' | 'create' | 'edit';

const useAdminEquipment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, isLoading, error } = useSelector((state: RootState) => state.adminEquipment);
    const { floors, zones } = useSelector((state: RootState) => state.adminOptions);

    // UI state
    const [modalMode, setModalMode] = useState<ModalMode>('closed');
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [formData, setFormData] = useState<EquipmentFormData>(EMPTY_FORM);
    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterActive, setFilterActive] = useState<'' | 'true' | 'false'>('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Load equipment + options
    useEffect(() => {
        dispatch(fetchEquipment());
        dispatch(getFloors());
        dispatch(getZones());
    }, [dispatch]);

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth < 768 ? 4 : 8);
            setCurrentPage(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Derived data: filtered + paginated
    const filteredAll = useMemo(() => {
        return items.filter((item) => {
            const matchSearch = !searchText ||
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.nameVi.toLowerCase().includes(searchText.toLowerCase());
            const matchCategory = !filterCategory || item.category === filterCategory;
            const matchActive = filterActive === '' || String(item.isActive) === filterActive;
            return matchSearch && matchCategory && matchActive;
        });
    }, [items, searchText, filterCategory, filterActive]);

    const totalPages = Math.ceil(filteredAll.length / itemsPerPage);
    const filteredItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAll.slice(start, start + itemsPerPage);
    }, [filteredAll, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages || 1));
    };

    // Category options from existing data
    const categoryOptions = useMemo(() => {
        const cats = new Set(items.map(i => i.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [items]);

    const subCategoryOptions = useMemo(() => {
        const subs = new Set(items.map(i => i.subCategory).filter(Boolean));
        return Array.from(subs).sort();
    }, [items]);

    // Toast helper
    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // Modal handlers
    const openCreate = useCallback(() => {
        setFormData(EMPTY_FORM);
        setEditingItem(null);
        setModalMode('create');
        setCurrentPage(1);
    }, []);

    const openEdit = useCallback((item: Equipment) => {
        const { id, updatedAt, ...rest } = item;
        setFormData(rest);
        setEditingItem(item);
        setModalMode('edit');
    }, []);

    const closeModal = useCallback(() => {
        setModalMode('closed');
        setEditingItem(null);
        dispatch(clearError());
    }, [dispatch]);

    const handleFormChange = useCallback((field: keyof EquipmentFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Image upload
    const handleUploadImages = async (files: FileList | null) => {
        if (!files) return;
        setUploadingImages(true);
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = await uploadImageToImgBB(files[i]);
            if (url) newUrls.push(url);
        }
        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...newUrls]
        }));
        setUploadingImages(false);
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    // Submit form
    const handleSubmit = useCallback(async () => {
        if (modalMode === 'create') {
            const result = await dispatch(createEquipment(formData));
            if (createEquipment.fulfilled.match(result)) {
                showSuccess('Tạo thiết bị thành công!');
                closeModal();
                dispatch(fetchEquipment()); // refresh list
            }
        } else if (modalMode === 'edit' && editingItem?.id) {
            const result = await dispatch(updateEquipment({ id: editingItem.id, data: formData }));
            if (updateEquipment.fulfilled.match(result)) {
                showSuccess('Cập nhật thiết bị thành công!');
                closeModal();
                dispatch(fetchEquipment());
            }
        }
    }, [modalMode, formData, editingItem, dispatch, closeModal]);

    // Delete
    const handleConfirmDelete = useCallback(async () => {
        if (!deletingId) return;
        const result = await dispatch(deleteEquipment(deletingId));
        if (deleteEquipment.fulfilled.match(result)) {
            showSuccess('Đã xoá thiết bị!');
        }
        setDeletingId(null);
        dispatch(fetchEquipment());
    }, [deletingId, dispatch]);

    return {
        // Data
        filteredItems,
        isLoading,
        error,
        successMsg,
        categoryOptions,
        subCategoryOptions,
        floors,
        zones,

        // Search/filter
        searchText, setSearchText,
        filterCategory, setFilterCategory,
        filterActive, setFilterActive,

        // Pagination
        currentPage,
        totalPages,
        goToPage,
        itemsPerPage,

        // Modal
        modalMode,
        formData,
        openCreate,
        openEdit,
        closeModal,
        handleFormChange,
        handleSubmit,

        // Image upload
        uploadingImages,
        handleUploadImages,
        removeImage,

        // Delete
        deletingId,
        setDeletingId,
        handleConfirmDelete,
    };
};

export default useAdminEquipment;