import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const RecentBookings: React.FC = () => {
    const { bookings, loading } = useAppSelector((state) => state.adminBooking);
    const { memberships } = useAppSelector((state) => state.adminCatalog);

    const pendingBookings = bookings.filter(b => b.status === 'pending').slice(0, 2);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').slice(0, 1);
    const displayBookings = [...pendingBookings, ...confirmedBookings].slice(0, 3);

    const getMembershipName = (memId: string) => {
        const mem = memberships.find(m => m.id === memId);
        return mem?.name || memId;
    };

    if (loading) {
        return (
            <div className="db-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 className="db-text-primary" style={{ fontWeight: 600 }}>Đơn mua gói</h3>
                    <Link to={ROUTES.ADMIN_BOOKINGS} className="db-link">Duyệt đơn</Link>
                </div>
                <div className="db-skeleton" style={{ height: '4rem', marginBottom: '0.75rem' }}></div>
                <div className="db-skeleton" style={{ height: '4rem' }}></div>
            </div>
        );
    }

    return (
        <div className="db-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 className="db-text-primary" style={{ fontWeight: 600 }}>Đơn mua gói</h3>
                <Link to={ROUTES.ADMIN_BOOKINGS} className="db-link">Duyệt đơn</Link>
            </div>
            {displayBookings.length === 0 ? (
                <p className="db-text-dim" style={{ fontSize: '0.875rem' }}>Chưa có đơn hàng nào.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {displayBookings.map(booking => (
                        <div key={booking.id} style={{ borderBottom: '1px solid var(--db-border)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p className="db-text-primary" style={{ fontWeight: 500 }}>
                                        {getMembershipName(booking.membershipId)}
                                    </p>
                                    <p className="db-text-muted" style={{ fontSize: '0.75rem', marginTop: '0.125rem' }}>
                                        KH: {booking.customerName} · {booking.totalPrice?.toLocaleString()}đ
                                    </p>
                                </div>
                                <span className={booking.status === 'pending' ? 'db-badge-orange' : 'db-badge-green'}>
                                    {booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã xác nhận'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentBookings;