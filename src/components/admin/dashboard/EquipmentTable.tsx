import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const EquipmentTable: React.FC = () => {
    const { items: equipment, isLoading } = useAppSelector((state) => state.adminEquipment);
    const { items: zones } = useAppSelector((state) => state.adminZones);

    const getZoneName = (zoneId: string) => zones.find(z => z.id === zoneId)?.name || zoneId;
    const displayItems = equipment.slice(0, 4);

    if (isLoading) {
        return (
            <div className="db-card">
                <div className="db-skeleton" style={{ height: '2rem', marginBottom: '1rem' }}></div>
                <div className="db-skeleton" style={{ height: '4rem', marginBottom: '1rem' }}></div>
                <div className="db-skeleton" style={{ height: '4rem' }}></div>
            </div>
        );
    }

    return (
        <div className="db-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="db-table-container">
                <table className="db-table">
                    <thead>
                    <tr>
                        <th>Tên thiết bị</th>
                        <th>Khu vực</th>
                        <th>Tình trạng</th>
                        <th>Số lượng</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayItems.map(item => (
                        <tr key={item.id}>
                            <td className="db-text-primary" style={{ fontWeight: 500 }}>{item.name}</td>
                            <td className="db-text-muted">{getZoneName(item.zoneId)}</td>
                            <td>
                                    <span className={item.isActive ? 'db-badge-green' : 'db-badge-red'}>
                                        {item.isActive ? 'Tốt' : 'Hỏng'}
                                    </span>
                            </td>
                            <td className="db-text-primary">{item.quantity}</td>
                            <td>
                                <Link to={`${ROUTES.ADMIN_EQUIPMENT}?edit=${item.id}`} className="db-link db-link-sm">Sửa</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {equipment.length > 4 && (
                <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--db-border)' }}>
                    <Link to={ROUTES.ADMIN_EQUIPMENT} className="db-link">
                        Xem tất cả {equipment.length} thiết bị →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default EquipmentTable;