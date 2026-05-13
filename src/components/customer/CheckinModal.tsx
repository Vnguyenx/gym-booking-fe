// src/components/customer/CheckinModal.tsx
// Modal cho customer nhập secret code để điểm danh.
// Hiển thị khi customer bấm nút "Điểm danh hôm nay".
//
// Luồng:
//  1. Customer nhập mã bí mật (6 ký tự, do admin tạo mỗi ngày lúc 00:00)
//  2. Bấm "Xác nhận"
//  3. Gọi customerService.checkin(secretCode)
//  4. Thành công → dispatch addAttendanceRecord → đóng modal + thông báo
//  5. Thất bại → hiện thông báo lỗi tương ứng từ BE

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addAttendanceRecord } from '../../store/classSlice';
import { customerService } from '../../services/customerService';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CheckinModalProps {
    /** ID của class đang được chọn để điểm danh */
    classId: string;
    /** Callback đóng modal (bấm Hủy hoặc sau khi điểm danh thành công) */
    onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Độ dài mã bí mật — khớp với BE (6 ký tự)
const SECRET_CODE_LENGTH = 6;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CheckinModal
 * Modal overlay với ô nhập mã bí mật.
 * Tự focus vào input khi mở.
 * Nhấn Escape để đóng.
 */
const CheckinModal: React.FC<CheckinModalProps> = ({ classId, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();

    // State của ô nhập mã
    const [code, setCode] = useState('');

    // Trạng thái loading khi đang gọi API
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Thông báo lỗi từ BE (sai code, hết hạn, v.v.)
    const [errorMessage, setErrorMessage] = useState('');

    // Thông báo thành công
    const [successMessage, setSuccessMessage] = useState('');

    // Ref để auto-focus input khi modal mở
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input khi modal xuất hiện
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Đóng modal khi nhấn Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    /** Cập nhật code, chuyển thành chữ hoa, giới hạn độ dài */
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toUpperCase()           // mã thường là chữ hoa
            .replace(/[^A-Z0-9]/g, '') // chỉ giữ chữ và số
            .slice(0, SECRET_CODE_LENGTH);
        setCode(value);
        setErrorMessage(''); // xóa lỗi cũ khi gõ lại
    };

    /** Gửi mã điểm danh lên BE */
    const handleSubmit = async () => {
        if (code.length !== SECRET_CODE_LENGTH) {
            setErrorMessage(`Vui lòng nhập đủ ${SECRET_CODE_LENGTH} ký tự.`);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // Gọi API điểm danh — trả về AttendanceRecord mới
            const newRecord = await customerService.checkin(classId, code);

            // Cập nhật Redux store ngay lập tức (không cần refetch)
            dispatch(addAttendanceRecord({ classId, record: newRecord }));

            setSuccessMessage('Điểm danh thành công! 🎉');

            // Đóng modal sau 1.5 giây để customer thấy thông báo
            setTimeout(() => onClose(), 1500);

        } catch (err: any) {
            // BE trả về message lỗi cụ thể (sai mã, đã điểm danh, hết hạn…)
            setErrorMessage(err.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /** Cho phép nhấn Enter để submit thay vì bấm nút */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        // Overlay tối phía sau modal — click ra ngoài để đóng
        <div className="modal-overlay" onClick={onClose}>

            {/* Hộp modal chính — stopPropagation để click bên trong không đóng */}
            <div
                className="modal-box checkin-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Nhập mã điểm danh"
            >
                {/* Tiêu đề */}
                <h2 className="modal-title">Điểm danh hôm nay</h2>
                <p className="modal-subtitle">
                    Nhập mã bí mật được cung cấp tại phòng tập.
                </p>

                {/* Ô nhập mã */}
                <input
                    ref={inputRef}
                    type="text"
                    className="checkin-input"
                    value={code}
                    onChange={handleCodeChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập mã (VD: AB12CD)"
                    maxLength={SECRET_CODE_LENGTH}
                    disabled={isSubmitting || !!successMessage}
                    aria-label="Mã bí mật điểm danh"
                    autoComplete="off"
                />

                {/* Hiển thị số ký tự đã nhập */}
                <p className="checkin-char-count">
                    {code.length}/{SECRET_CODE_LENGTH} ký tự
                </p>

                {/* Thông báo lỗi */}
                {errorMessage && (
                    <p className="checkin-error" role="alert">
                        ⚠ {errorMessage}
                    </p>
                )}

                {/* Thông báo thành công */}
                {successMessage && (
                    <p className="checkin-success" role="status">
                        ✓ {successMessage}
                    </p>
                )}

                {/* Nút hành động */}
                <div className="modal-actions">
                    <button
                        className="btn btn--secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>

                    <button
                        className="btn btn--primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || code.length !== SECRET_CODE_LENGTH || !!successMessage}
                    >
                        {isSubmitting ? 'Đang xử lý…' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckinModal;