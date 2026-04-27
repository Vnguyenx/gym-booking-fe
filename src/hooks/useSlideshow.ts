import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSlideshowOptions {
    total: number;
    interval?: number; // ms, mặc định 5500
    enabled?: boolean; // false khi loading
}

interface UseSlideshowReturn {
    currentIndex: number;
    goToSlide: (index: number) => void;
    handlers: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchEnd:   (e: React.TouchEvent) => void;
    };
}

/**
 * Hook quản lý toàn bộ logic slideshow:
 * - Tự động chuyển slide theo interval
 * - Pause khi hover, resume khi rời
 * - Swipe cảm ứng (ngưỡng 50px)
 * - Vòng lặp vô hạn (circular)
 */
export const useSlideshow = ({
                                 total,
                                 interval = 5500,
                                 enabled = true,
                             }: UseSlideshowOptions): UseSlideshowReturn => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchXRef = useRef(0);

    /* Chuyển slide với vòng lặp */
    const goToSlide = useCallback((index: number) => {
        if (total === 0) return;
        setCurrentIndex(((index % total) + total) % total);
    }, [total]);

    /* Khởi động / reset timer */
    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (total <= 1) return;
        timerRef.current = setInterval(() => {
            setCurrentIndex(cur => (cur + 1) % total);
        }, interval);
    }, [total, interval]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    /* Reset timer mỗi khi slide thay đổi */
    useEffect(() => {
        if (!enabled || total <= 1) return;
        startTimer();
        return stopTimer;
    }, [currentIndex, enabled, total, startTimer, stopTimer]);

    /* Swipe handlers */
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchXRef.current = e.changedTouches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchXRef.current;
        if (Math.abs(dx) > 50) {
            goToSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
        }
    }, [currentIndex, goToSlide]);

    return {
        currentIndex,
        goToSlide,
        handlers: {
            onMouseEnter: stopTimer,
            onMouseLeave: startTimer,
            onTouchStart: handleTouchStart,
            onTouchEnd:   handleTouchEnd,
        },
    };
};