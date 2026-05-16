// src/components/pt/PtTabProfile.tsx
// Tab Cá nhân — xem và chỉnh sửa hồ sơ PT: thông tin cơ bản + chuyên môn.

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePTProfile, clearProfileStatus } from '../../store/ptDashBoardSlice';
import {
    selectProfileSaving,
    selectProfileError,
    selectProfileSuccess,
} from '../../store/selectors/ptSelectors';
import useLogout from '../../hooks/useLogout';
import { PTProfileFormData } from '../../types/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name?: string | null) =>
    (name ?? 'PT')
        .split(' ')
        .slice(-2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

// ─── Component chính ──────────────────────────────────────────────────────────

const PtTabProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const user     = useAppSelector((s) => s.auth.user);

    const isSaving    = useAppSelector(selectProfileSaving);
    const saveError   = useAppSelector(selectProfileError);
    const saveSuccess = useAppSelector(selectProfileSuccess);

    const { isLoggingOut, handleLogout } = useLogout();

    const [isEditing, setIsEditing] = useState(false);

    // Form state — chỉ các field PT được phép sửa
    const [form, setForm] = useState<PTProfileFormData>({
        bio:         '',
        specialty:   [],
        experience:  '',
        isAvailable: true,
    });

    // Specialty dạng string để nhập vào input, split bằng dấu phẩy
    const [specialtyInput, setSpecialtyInput] = useState('');

    // Xoá status khi mở form lại
    useEffect(() => {
        if (isEditing) dispatch(clearProfileStatus());
    }, [isEditing, dispatch]);

    // Đóng form sau khi lưu thành công
    useEffect(() => {
        if (saveSuccess) {
            setTimeout(() => {
                setIsEditing(false);
                dispatch(clearProfileStatus());
            }, 1200);
        }
    }, [saveSuccess, dispatch]);

    const handleEdit = () => {
        // Điền form từ data hiện tại của user (PT có thêm field chuyên môn)
        const pt = user as any; // cast vì PT có thêm fields ngoài UserProfile
        setForm({
            bio:         pt?.bio         ?? '',
            specialty:   pt?.specialty   ?? [],
            experience:  pt?.experience  ?? '',
            isAvailable: pt?.isAvailable ?? true,
        });
        setSpecialtyInput((pt?.specialty ?? []).join(', '));
        setIsEditing(true);
    };

    const handleSave = () => {
        const specialty = specialtyInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        dispatch(updatePTProfile({ ...form, specialty }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        dispatch(clearProfileStatus());
    };

    const pt = user as any;

    return (
        <div>
            {/* ── Avatar + tên ── */}
            <div className="profile-top">
                <div className="avt-lg">
                    {user?.avatarUrl
                        ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : getInitials(user?.displayName)
                    }
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{user?.displayName ?? 'PT'}</div>
                    <div style={{ fontSize: 12, color: 'var(--txt2)', marginTop: 3 }}>
                        PT · {pt?.gender ?? ''} · {pt?.isAvailable ? 'Đang nhận học viên' : 'Tạm ngưng'}
                    </div>
                </div>
            </div>

            {/* Alert thành công / lỗi */}
            {saveSuccess && (
                <p style={{ fontSize: 13, color: 'var(--ok)', background: 'var(--ok-bg)', borderRadius: 'var(--r)', padding: '8px 12px', marginBottom: 10 }}>
                    ✓ Lưu hồ sơ thành công.
                </p>
            )}
            {saveError && (
                <p style={{ fontSize: 13, color: 'var(--err)', background: 'var(--err-bg)', borderRadius: 'var(--r)', padding: '8px 12px', marginBottom: 10 }}>
                    ⚠ {saveError}
                </p>
            )}

            {/* ── Thông tin cơ bản (không cho sửa) ── */}
            <div className="sec-label">Thông tin cơ bản</div>
            <div className="info-card">
                <div className="info-row">
                    <span className="info-lbl">Họ tên</span>
                    <span className="info-val">{user?.displayName ?? '—'}</span>
                </div>
                <div className="info-row">
                    <span className="info-lbl">Giới tính</span>
                    <span className="info-val">{pt?.gender ?? '—'}</span>
                </div>
                <div className="info-row">
                    <span className="info-lbl">Email</span>
                    <span className="info-val" style={{ color: 'var(--info)' }}>{user?.email ?? '—'}</span>
                </div>
                <div className="info-row">
                    <span className="info-lbl">SĐT</span>
                    <span className="info-val">{user?.phone ?? '—'}</span>
                </div>
            </div>

            {/* ── Chuyên môn ── */}
            <div className="sec-label">Chuyên môn</div>

            {isEditing ? (
                <div className="info-card">
                    {/* Kinh nghiệm */}
                    <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                        <span className="info-lbl">Kinh nghiệm</span>
                        <input
                            type="text"
                            value={form.experience}
                            onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                            placeholder="VD: 5 năm"
                            style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 'var(--r)', border: '0.5px solid var(--bd2)', background: 'var(--bg1)', color: 'var(--txt)' }}
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="info-row">
                        <span className="info-lbl">Nhận học viên</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                            />
                            <span style={{ fontSize: 13 }}>{form.isAvailable ? 'Đang mở' : 'Tạm ngưng'}</span>
                        </label>
                    </div>
                </div>
            ) : (
                <div className="info-card">
                    <div className="info-row">
                        <span className="info-lbl">Kinh nghiệm</span>
                        <span className="info-val">{pt?.experience ?? '—'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-lbl">Trạng thái</span>
                        <span className="info-val">
                            <span className={`bdg ${pt?.isAvailable ? 'ok' : 'neu'}`}>
                                {pt?.isAvailable ? 'Đang nhận học viên' : 'Tạm ngưng'}
                            </span>
                        </span>
                    </div>
                </div>
            )}

            {/* ── Chuyên ngành ── */}
            <div className="sec-label">Chuyên ngành</div>
            {isEditing ? (
                <div style={{ marginBottom: 10 }}>
                    <input
                        type="text"
                        value={specialtyInput}
                        onChange={(e) => setSpecialtyInput(e.target.value)}
                        placeholder="Giảm cân, Tăng cơ, Cardio, ..."
                        style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 'var(--r)', border: '0.5px solid var(--bd2)', background: 'var(--bg1)', color: 'var(--txt)' }}
                    />
                    <p style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 4 }}>Phân cách bằng dấu phẩy</p>
                </div>
            ) : (
                <div className="tag-wrap" style={{ marginBottom: 10 }}>
                    {(pt?.specialty ?? []).length === 0
                        ? <span style={{ fontSize: 13, color: 'var(--txt2)' }}>—</span>
                        : (pt?.specialty as string[]).map((s) => (
                            <span key={s} className="tag">{s}</span>
                        ))
                    }
                </div>
            )}

            {/* ── Giới thiệu ── */}
            <div className="sec-label">Giới thiệu</div>
            {isEditing ? (
                <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={4}
                    placeholder="Mô tả ngắn về bản thân, phong cách huấn luyện..."
                    style={{ width: '100%', padding: '10px 12px', fontSize: 13, borderRadius: 'var(--rl)', border: '0.5px solid var(--bd2)', background: 'var(--bg1)', color: 'var(--txt)', resize: 'vertical', marginBottom: 10 }}
                />
            ) : (
                <div className="info-card" style={{ marginBottom: 10 }}>
                    <div style={{ padding: '11px 14px', fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6 }}>
                        {pt?.bio || '—'}
                    </div>
                </div>
            )}

            {/* ── Nút hành động ── */}
            {isEditing ? (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <button
                        className="btn-edit"
                        style={{ flex: 1, background: 'var(--accent)', color: 'var(--accent-txt)', border: 'none' }}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Đang lưu…' : 'Lưu thay đổi'}
                    </button>
                    <button className="btn-edit" onClick={handleCancel} disabled={isSaving}>
                        Huỷ
                    </button>
                </div>
            ) : (
                <button className="btn-edit" onClick={handleEdit}>
                    <i className="ti ti-edit" aria-hidden="true" />
                    Chỉnh sửa hồ sơ
                </button>
            )}

            <button
                className="btn-logout"
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
            </button>
        </div>
    );
};

export default PtTabProfile;