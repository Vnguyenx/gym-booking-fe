// src/components/booking/BookingProgress.tsx
// Thanh tiến trình hiển thị user đang ở bước nào
// Mobile first: hiển thị gọn trên điện thoại

import React from 'react';

interface BookingProgressProps {
    currentStep: number;
    maxSteps: number;
}

// Label từng bước theo số lượng bước
const STEP_LABELS: Record<number, string[]> = {
    3: ['Dịch vụ PT', 'Chọn PT', 'Thanh toán'],
    4: ['Gói tập', 'Dịch vụ PT', 'Chọn PT', 'Thanh toán'],
};

const BookingProgress: React.FC<BookingProgressProps> = ({ currentStep, maxSteps }) => {
    const labels = STEP_LABELS[maxSteps] || STEP_LABELS[4];

    return (
        <div className="booking-progress">
            {labels.map((label, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;

                return (
                    <React.Fragment key={stepNumber}>
                        {/* Bước */}
                        <div className={`progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="progress-step__circle">
                                {/* Hiện dấu tick nếu đã qua, số nếu chưa */}
                                {isCompleted ? '✓' : stepNumber}
                            </div>
                            <span className="progress-step__label">{label}</span>
                        </div>

                        {/* Đường nối giữa các bước (không hiện sau bước cuối) */}
                        {stepNumber < maxSteps && (
                            <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BookingProgress;