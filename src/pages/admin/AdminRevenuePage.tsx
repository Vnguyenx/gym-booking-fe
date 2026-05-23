// src/pages/admin/RevenuePage.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRevenueByMonth, fetchRevenueByYear,
    fetchRevenueByWeek, fetchRevenueByRange,
    setCurrentFilter } from '../../store/admin/adminRevenueSlice';
import RevenueChart from '../../components/admin/revenue/RevenueChart';
import BookingsTable from '../../components/admin/revenue/BookingsTable';
import '../../styles/admin/RevenuePage.css';

const RevenuePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentFilter, monthData, yearData, weekData, rangeData, isLoading, error } = useAppSelector(state => state.adminRevenue);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekNumber());
    const [rangeStart, setRangeStart] = useState(new Date().toISOString().slice(0, 10));
    const [rangeEnd, setRangeEnd] = useState(new Date().toISOString().slice(0, 10));

    function getCurrentWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
    }

    useEffect(() => {
        if (currentFilter === 'month') {
            dispatch(fetchRevenueByMonth({ month: selectedMonth, year: selectedYear }));
        } else if (currentFilter === 'year') {
            dispatch(fetchRevenueByYear(selectedYear));
        } else if (currentFilter === 'week') {
            dispatch(fetchRevenueByWeek({ week: selectedWeek, year: selectedYear }));
        } else if (currentFilter === 'range') {
            dispatch(fetchRevenueByRange({ start: rangeStart, end: rangeEnd }));
        }
    }, [currentFilter, selectedMonth, selectedYear, selectedWeek, rangeStart, rangeEnd, dispatch]);

    let chartData: { name: string; revenue: number }[] = [];
    let totalRevenue = 0;
    let bookingCount = 0;

    if (currentFilter === 'month' && monthData) {
        chartData = Object.entries(monthData.byDay).map(([day, revenue]) => ({ name: `Ngày ${day}`, revenue }));
        totalRevenue = monthData.totalRevenue;
        bookingCount = monthData.bookings?.length ?? 0;
    } else if (currentFilter === 'year' && yearData) {
        chartData = Object.entries(yearData.monthlyRevenue).map(([month, revenue]) => ({ name: `Tháng ${month}`, revenue }));
        totalRevenue = Object.values(yearData.monthlyRevenue).reduce((a, b) => a + b, 0);
    } else if (currentFilter === 'week' && weekData) {
        chartData = Object.entries(weekData.dailyRevenue).map(([date, revenue]) => ({ name: date.slice(5), revenue }));
        totalRevenue = Object.values(weekData.dailyRevenue).reduce((a, b) => a + b, 0);
    } else if (currentFilter === 'range' && rangeData) {
        chartData = [{ name: 'Tổng', revenue: rangeData.totalRevenue }];
        totalRevenue = rangeData.totalRevenue;
        bookingCount = rangeData.count ?? 0;
    }

    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <div className="revenue-page">
            <div className="revenue-container">
                <h1 className="page-title">Thống kê doanh thu</h1>

                <div className="filter-bar">
                    <button className={currentFilter === 'month' ? 'active' : ''} onClick={() => dispatch(setCurrentFilter('month'))}>Theo tháng</button>
                    <button className={currentFilter === 'year' ? 'active' : ''} onClick={() => dispatch(setCurrentFilter('year'))}>Theo năm</button>
                    <button className={currentFilter === 'week' ? 'active' : ''} onClick={() => dispatch(setCurrentFilter('week'))}>Theo tuần</button>
                    <button className={currentFilter === 'range' ? 'active' : ''} onClick={() => dispatch(setCurrentFilter('range'))}>Tùy chọn</button>
                </div>

                <div className="filter-controls">
                    {currentFilter === 'month' && (
                        <div className="filter-group">
                            <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                            </select>
                            <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    )}
                    {currentFilter === 'year' && (
                        <div className="filter-group">
                            <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    )}
                    {currentFilter === 'week' && (
                        <div className="filter-group">
                            <input type="number" value={selectedWeek} onChange={e => setSelectedWeek(parseInt(e.target.value))} min={1} max={53} />
                            <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    )}
                    {currentFilter === 'range' && (
                        <div className="filter-group">
                            <label>Từ: <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} /></label>
                            <label>Đến: <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} /></label>
                        </div>
                    )}
                </div>

                {isLoading && <div className="loading">Đang tải dữ liệu...</div>}
                {error && <div className="error">Lỗi: {error}</div>}

                {!isLoading && !error && (
                    <>
                        <div className="summary-card">
                            <div className="total-revenue">Tổng doanh thu: <span>{formatCurrency(totalRevenue)}</span></div>
                            {bookingCount > 0 && <div className="total-bookings">Số đơn hàng: {bookingCount}</div>}
                        </div>

                        {chartData.length > 0 && (
                            <div className="chart-wrapper">
                                <RevenueChart data={chartData} />
                            </div>
                        )}

                        {currentFilter === 'month' && monthData?.bookings && monthData.bookings.length > 0 && (
                            <BookingsTable
                                bookings={monthData.bookings}
                                title={`Chi tiết đơn hàng - Tháng ${selectedMonth}/${selectedYear}`}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        {currentFilter === 'range' && rangeData?.bookings && rangeData.bookings.length > 0 && (
                            <BookingsTable
                                bookings={rangeData.bookings}
                                title={`Chi tiết đơn hàng từ ${rangeStart} đến ${rangeEnd}`}
                                formatCurrency={formatCurrency}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RevenuePage;