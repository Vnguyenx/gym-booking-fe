import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchZones, createZone, updateZone, deleteZone } from '../../../store/admin/adminZonesSlice';
import { fetchFloors } from '../../../store/admin/adminFloorsSlice';
import { Zone } from '../../../types/models';

const ZonesManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: zones, isLoading, error } = useAppSelector(state => state.adminZones);
    const { items: floors } = useAppSelector(state => state.adminFloors);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Zone>>({ name: '', description: '', floorId: '' });

    useEffect(() => { dispatch(fetchZones()); dispatch(fetchFloors()); }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedFloor = floors.find(f => f.id === formData.floorId);
        if (!formData.name || !formData.floorId || !selectedFloor) return alert('Vui lòng chọn tầng');
        const dataToSend = { ...formData, gymId: selectedFloor.gymId } as Omit<Zone, 'id'>;
        if (editingId) await dispatch(updateZone({ id: editingId, data: dataToSend }));
        else await dispatch(createZone(dataToSend));
        resetForm();
    };

    const resetForm = () => { setEditingId(null); setFormData({ name: '', description: '', floorId: '' }); };
    const handleEdit = (zone: Zone) => { setEditingId(zone.id!); setFormData(zone); };
    const handleDelete = async (id: string) => { if (window.confirm('Xóa khu vực này?')) await dispatch(deleteZone(id)); };

    if (isLoading && zones.length === 0) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="manager-section">
            <h3>Quản lý khu vực</h3>
            <form onSubmit={handleSubmit} className="form-vertical">
                <div className="form-group"><label>Tên khu vực</label><input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="form-group"><label>Mô tả</label><input value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="form-group"><label>Thuộc tầng</label><select value={formData.floorId || ''} onChange={e => setFormData({ ...formData, floorId: e.target.value })}><option value="">-- Chọn tầng --</option>{floors.map(floor => <option key={floor.id} value={floor.id}>{floor.name} (tầng {floor.floorNumber})</option>)}</select></div>
                <div className="form-actions"><button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>{editingId && <button type="button" onClick={resetForm}>Hủy</button>}</div>
            </form>
            <div className="items-grid">
                {zones.map(zone => {
                    const floor = floors.find(f => f.id === zone.floorId);
                    return (
                        <div key={zone.id} className="item-card" style={{ padding: '1rem' }}>
                            <div className="info">
                                <strong>{zone.name}</strong>
                                <span>{zone.description}</span>
                                <span className="meta">Tầng: {floor ? floor.name : zone.floorId}</span>
                            </div>
                            <div className="actions">
                                <button onClick={() => handleEdit(zone)}>Sửa</button>
                                <button onClick={() => handleDelete(zone.id!)}>Xóa</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ZonesManager;