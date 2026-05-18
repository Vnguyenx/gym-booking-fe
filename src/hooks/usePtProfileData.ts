// src/hooks/pt/usePtProfileData.ts
//
// Hook fetch và merge thông tin PT đầy đủ:
//   - authSlice     → uid, email, displayName, role, phone
//   - ptProfileSlice → bio, specialty[], experience, isAvailable, avatar
//
// Fetch 1 lần khi mount (flag `fetched`), không fetch lại khi chuyển tab.
// Dùng trong PtDashboard để preload trước khi vào tab Profile.
//
// Data shape trả về dùng thẳng trong usePtProfile hook.

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyPtProfile } from '../store/ptProfileSlice';

export interface MergedPtUser {
    // Từ authSlice
    uid:         string;
    email:       string;
    displayName: string;
    phone:       string;
    role:        string;
    // Từ ptProfileSlice (Firestore pts)
    fullName:    string;   // PT.fullName — tên đầy đủ
    gender:      string;
    bio:         string;
    specialty:   string[];
    experience:  string;
    isAvailable: boolean;
    avatar:      string;   // URL ảnh PT
}

export function usePtProfileData(): {
    ptUser:   MergedPtUser | null;
    loading:  boolean;
    error:    string | null;
} {
    const dispatch = useAppDispatch();

    // Thông tin session từ authSlice
    const authUser = useAppSelector((state) => state.auth.user);

    // Thông tin PT-specific từ ptProfileSlice
    const { profile, loading, error, fetched } = useAppSelector(
        (state) => (state as any).ptProfile,
    );

    // Fetch 1 lần nếu chưa có data
    useEffect(() => {
        if (!fetched && authUser?.role === 'pt') {
            dispatch(fetchMyPtProfile());
        }
    }, [fetched, authUser?.role, dispatch]);

    // Merge 2 nguồn thành 1 object đầy đủ
    const ptUser: MergedPtUser | null =
        authUser && profile
            ? {
                // Auth fields
                uid:         authUser.uid,
                email:       authUser.email,
                displayName: authUser.displayName,
                phone:       authUser.phone,
                role:        authUser.role,
                // PT profile fields
                fullName:    profile.fullName    ?? authUser.displayName,
                gender:      profile.gender      ?? '—',
                bio:         profile.bio         ?? '',
                specialty:   Array.isArray(profile.specialty) ? profile.specialty : [],
                experience:  profile.experience  ?? '—',
                isAvailable: profile.isAvailable ?? false,
                avatar:      profile.avatar      ?? authUser.avatarUrl ?? '',
            }
            : null;

    return { ptUser, loading, error };
}