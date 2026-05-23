// src/components/admin/PtInfoForm.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPtInfo, updatePtInfo } from '../../../store/admin/adminPtInfoSlice';
import { PTInfo, Benefit } from '../../../types/models';

const PtInfoForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector(state => state.adminPtInfo);
    const [formData, setFormData] = useState<Partial<PTInfo>>({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => { dispatch(fetchPtInfo()); }, [dispatch]);
    useEffect(() => { if (data) setFormData(data); }, [data]);

    const handleChange = (field: keyof PTInfo, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); setIsDirty(true); };
    const handleBenefitChange = (index: number, field: keyof Benefit, value: string) => {
        const newBenefits = [...(formData.Benefits || [])];
        newBenefits[index] = { ...newBenefits[index], [field]: value };
        handleChange('Benefits', newBenefits);
    };
    const addBenefit = () => handleChange('Benefits', [...(formData.Benefits || []), { title: '', content: '' }]);
    const removeBenefit = (index: number) => handleChange('Benefits', (formData.Benefits || []).filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(updatePtInfo(formData));
        setIsDirty(false);
        await dispatch(fetchPtInfo());
    };

    if (isLoading && !data) return <div>Đang tải thông tin PT...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="manager-section">
            <h3>Thông tin Huấn luyện viên (PT)</h3>
            <form onSubmit={handleSubmit} className="form-vertical">
                <div className="form-group"><label>Mô tả chung</label><textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} /></div>
                <div className="form-group"><label>Ảnh đại diện (URL)</label><input value={formData.img || ''} onChange={e => handleChange('img', e.target.value)} />{formData.img && <img src={formData.img} alt="PT" className="preview-img" />}</div>
                <h4>Danh sách lợi ích (Benefits)</h4>
                {formData.Benefits?.map((benefit, idx) => (<div key={idx} className="benefit-item"><input placeholder="Tiêu đề" value={benefit.title} onChange={e => handleBenefitChange(idx, 'title', e.target.value)} /><input placeholder="Nội dung" value={benefit.content} onChange={e => handleBenefitChange(idx, 'content', e.target.value)} /><button type="button" onClick={() => removeBenefit(idx)}>Xóa</button></div>))}
                <button type="button" onClick={addBenefit}>+ Thêm lợi ích</button>
                <div className="form-actions"><button type="submit" disabled={!isDirty || isLoading}>Lưu thay đổi</button></div>
            </form>
        </div>
    );
};

export default PtInfoForm;