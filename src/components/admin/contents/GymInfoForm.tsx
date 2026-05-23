// src/components/admin/GymInfoForm.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchGymInfo, updateGymInfo } from '../../../store/admin/adminGymInfoSlice';
import { GymInfo } from '../../../types/models';
import { uploadImageToImgBB } from '../../../services/uploadService';
import ToggleSwitch from '../../common/ToggleSwitch';

const GymInfoForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector(state => state.adminGymInfo);
    const [formData, setFormData] = useState<Partial<GymInfo>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    useEffect(() => { dispatch(fetchGymInfo()); }, [dispatch]);
    useEffect(() => { if (data) setFormData(data); }, [data]);

    const handleChange = (field: keyof GymInfo, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleLocationChange = (field: keyof GymInfo['location'], value: any) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, [field]: value } as GymInfo['location']
        }));
        setIsDirty(true);
    };

    // Helper an toàn: cập nhật amenities, luôn giữ đủ các field
    const updateAmenities = (updater: (prev: GymInfo['amenities']) => GymInfo['amenities']) => {
        setFormData(prev => {
            const defaultAmenities = {
                locker: false, parking: false, parkingNote: '', shower: false,
                toilet: false, toiletNote: '', waterFilter: 0, waterFilterNote: '', wifi: false, wifiNote: ''
            };
            const current = prev.amenities || defaultAmenities;
            return { ...prev, amenities: updater(current) };
        });
        setIsDirty(true);
    };

    const handleAmenitiesToggle = (field: keyof GymInfo['amenities'], checked: boolean) => {
        updateAmenities(prev => {
            const newAmenities = { ...prev, [field]: checked };
            // Nếu tắt, reset các note liên quan
            if (field === 'parking' && !checked) newAmenities.parkingNote = '';
            if (field === 'toilet' && !checked) newAmenities.toiletNote = '';
            if (field === 'waterFilter' && !checked) {
                newAmenities.waterFilter = 0;
                newAmenities.waterFilterNote = '';
            }
            if (field === 'wifi' && !checked) newAmenities.wifiNote = '';
            return newAmenities;
        });
    };

    const handleAmenitiesNoteChange = (field: 'parkingNote' | 'toiletNote' | 'waterFilterNote' | 'wifiNote', value: string) => {
        updateAmenities(prev => ({ ...prev, [field]: value }));
    };

    const handleWaterFilterNumberChange = (value: number) => {
        updateAmenities(prev => ({ ...prev, waterFilter: value }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCover(true);
        const url = await uploadImageToImgBB(file);
        setUploadingCover(false);
        if (url) handleChange('coverImageUrl', url);
        else alert('Upload ảnh thất bại');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(updateGymInfo(formData));
        setIsDirty(false);
        await dispatch(fetchGymInfo());
    };

    if (isLoading && !data) return <div className="loading">Đang tải thông tin gym...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    const amenities = formData.amenities || {
        locker: false, parking: false, parkingNote: '', shower: false,
        toilet: false, toiletNote: '', waterFilter: 0, waterFilterNote: '', wifi: false, wifiNote: ''
    };

    return (
        <div className="manager-section">
            <h3>Thông tin phòng Gym</h3>
            <form onSubmit={handleSubmit} className="form-vertical">
                {/* Các trường cơ bản */}
                <div className="form-group"><label>Tên gym</label><input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} /></div>
                <div className="form-group"><label>Mô tả</label><textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={3} /></div>
                <div className="form-group"><label>Địa chỉ</label><input value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} /></div>
                <div className="form-group"><label>Số điện thoại</label><input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} /></div>
                <div className="form-group"><label>Giờ mở cửa</label><input value={formData.openTime || ''} onChange={e => handleChange('openTime', e.target.value)} /></div>
                <div className="form-group"><label>Số tầng</label><input type="number" value={formData.totalFloors || 0} onChange={e => handleChange('totalFloors', parseInt(e.target.value))} /></div>
                <div className="form-group"><label>Ảnh bìa</label><input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} />{uploadingCover && <span>Đang upload...</span>}{formData.coverImageUrl && <img src={formData.coverImageUrl} alt="cover" className="preview-img" />}</div>

                <h4>Vị trí bản đồ</h4>
                <div className="form-group"><label>Vĩ độ</label><input type="number" step="any" value={formData.location?.latitude || ''} onChange={e => handleLocationChange('latitude', parseFloat(e.target.value))} /></div>
                <div className="form-group"><label>Kinh độ</label><input type="number" step="any" value={formData.location?.longitude || ''} onChange={e => handleLocationChange('longitude', parseFloat(e.target.value))} /></div>
                <div className="form-group"><label>URL bản đồ</label><input value={formData.location?.mapUrl || ''} onChange={e => handleLocationChange('mapUrl', e.target.value)} /></div>

                <h4>Tiện ích</h4>
                <div className="form-group row"><ToggleSwitch checked={amenities.locker} onChange={(checked) => updateAmenities(prev => ({ ...prev, locker: checked }))} label="Tủ đồ" /></div>
                <div className="form-group row"><ToggleSwitch checked={amenities.parking} onChange={(checked) => handleAmenitiesToggle('parking', checked)} label="Bãi đỗ xe" /></div>
                {amenities.parking && <div className="form-group"><label>Ghi chú bãi đỗ xe</label><input value={amenities.parkingNote || ''} onChange={e => handleAmenitiesNoteChange('parkingNote', e.target.value)} /></div>}
                <div className="form-group row"><ToggleSwitch checked={amenities.shower} onChange={(checked) => updateAmenities(prev => ({ ...prev, shower: checked }))} label="Vòi tắm" /></div>
                <div className="form-group row"><ToggleSwitch checked={amenities.toilet} onChange={(checked) => handleAmenitiesToggle('toilet', checked)} label="Nhà vệ sinh" /></div>
                {amenities.toilet && <div className="form-group"><label>Ghi chú nhà vệ sinh</label><input value={amenities.toiletNote || ''} onChange={e => handleAmenitiesNoteChange('toiletNote', e.target.value)} /></div>}
                <div className="form-group row"><ToggleSwitch checked={amenities.waterFilter > 0} onChange={(checked) => handleAmenitiesToggle('waterFilter', checked)} label="Máy lọc nước" /></div>
                {amenities.waterFilter > 0 && (
                    <>
                        <div className="form-group"><label>Số lượng máy lọc</label><input type="number" value={amenities.waterFilter} onChange={e => handleWaterFilterNumberChange(parseInt(e.target.value))} /></div>
                        <div className="form-group"><label>Ghi chú máy lọc nước</label><input value={amenities.waterFilterNote || ''} onChange={e => handleAmenitiesNoteChange('waterFilterNote', e.target.value)} /></div>
                    </>
                )}
                <div className="form-group row"><ToggleSwitch checked={amenities.wifi} onChange={(checked) => handleAmenitiesToggle('wifi', checked)} label="Wifi" /></div>
                {amenities.wifi && <div className="form-group"><label>Ghi chú Wifi</label><input value={amenities.wifiNote || ''} onChange={e => handleAmenitiesNoteChange('wifiNote', e.target.value)} /></div>}

                <div className="form-actions"><button type="submit" disabled={!isDirty || isLoading}>Lưu thay đổi</button></div>
            </form>
        </div>
    );
};

export default GymInfoForm;