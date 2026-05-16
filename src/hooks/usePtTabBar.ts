// src/hooks/pt/usePtTabBar.ts
//
// Hook cho PtTabBar.
// Tính số badge hiển thị trên tab Thông báo (dấu chấm đỏ).
// Logic tách ở đây để TabBar UI không cần biết Redux.

import { useAppSelector } from '../store/hooks';
import { selectPendingConfirms } from '../store/selectors/ptSelectors';

export interface PtTabBarData {
    /** Số buổi chờ xác nhận — > 0 thì hiện dot đỏ trên tab Thông báo */
    pendingCount: number;
}

export function usePtTabBar(): PtTabBarData {
    const pendingItems = useAppSelector(selectPendingConfirms);
    return { pendingCount: pendingItems.length };
}