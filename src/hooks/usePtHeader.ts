// src/hooks/pt/usePtHeader.ts
//
// Thay đổi: dùng state.auth.user thay vì (state as any).auth?.user
// authSlice có displayName — dùng luôn, không cần ptProfileSlice ở đây

import { useAppSelector }      from '../store/hooks';
import { selectPendingConfirms } from '../store/selectors/ptSelectors';

export interface PtHeaderData {
    displayName:    string;
    avatarInitials: string;
    pendingCount:   number;
    avatarUrl:      string | null;
}

function getInitials(fullName: string): string {
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return words.slice(0, 3).map((w) => w[0].toUpperCase()).join('');
}

export function usePtHeader(): PtHeaderData {
    // authSlice.user.displayName — đúng với authSlice interface
    const displayName: string = useAppSelector(
        (state) => state.auth.user?.displayName ?? 'PT',
    );

    const avatarUrl: string | null = useAppSelector(
        (state) => state.ptProfile.profile?.avatar ?? null,
    );

    const pendingItems = useAppSelector(selectPendingConfirms);


    return {
        displayName,
        avatarInitials: getInitials(displayName),
        avatarUrl,
        pendingCount:   pendingItems.length,
    };
}