import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePTRegister } from "../../hooks/usePTRegister";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import "../../styles/pages/pt-register.css";

const PTRegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, isPT, isAdmin } = useAuth();
    const {
        formData,
        specialtyInput,
        setSpecialtyInput,
        imagePreview,
        loading,
        submitted,
        handleChange,
        handleFileChange,
        handleSubmit,
    } = usePTRegister();

    // Flag để chỉ fill thông tin một lần duy nhất
    const hasFilled = useRef(false);

    // 1. Kiểm tra quyền: nếu đã là PT hoặc Admin thì redirect
    useEffect(() => {
        if (!authLoading) {
            if (user && (isPT || isAdmin)) {
                alert("Bạn đã là PT/Admin, không thể đăng ký thêm!");
                navigate("/");
            }
        }
    }, [user, authLoading, isPT, isAdmin, navigate]);

    // 2. Tự động điền thông tin nếu user là customer và chưa fill
    useEffect(() => {
        if (!authLoading && user && user.role === ROLES.CUSTOMER && !hasFilled.current) {
            // Tạo event giả lập để gọi handleChange
            const fillField = (name: string, value: string) => {
                if (value) {
                    handleChange({
                        target: { name, value },
                    } as React.ChangeEvent<HTMLInputElement>);
                }
            };
            fillField("fullName", user.displayName || "");
            fillField("email", user.email || "");
            fillField("phone", user.phone || "");
            hasFilled.current = true;
        }
    }, [authLoading, user, handleChange]);

    // Hiển thị loading khi đang kiểm tra auth
    if (authLoading) {
        return (
            <div className="pt-register-page">
                <div className="pt-register__wrapper">
                    <div className="pt-register__loading">Đang tải...</div>
                </div>
            </div>
        );
    }

    // Nếu là PT/Admin thì không render gì (useEffect đã redirect)
    if (user && (isPT || isAdmin)) {
        return null;
    }

    // 3. Giao diện sau khi gửi thành công
    if (submitted) {
        return (
            <div className="pt-register-page">
                <div className="pt-register__wrapper">
                    <div className="pt-register__success">
                        <div className="success-icon">✅</div>
                        <h2>Đăng Ký Thành Công!</h2>
                        <p>
                            Hồ sơ của bạn đã được gửi. Vui lòng chờ Admin xét duyệt.
                            Chúng tôi sẽ liên hệ qua email hoặc số điện thoại bạn đã cung cấp.
                        </p>
                        <button className="btn btn--primary mt-4" onClick={() => navigate("/")}>
                            Về Trang Chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Form đăng ký
    return (
        <div className="pt-register-page">
            <div className="pt-register__wrapper">
                <button className="btn btn--back" onClick={() => navigate(-1)}>
                    ← Quay Lại
                </button>

                <div className="pt-register__header">
                    <h1 className="sec-title">Đăng Ký Làm PT</h1>
                    <p className="sec-desc">
                        Điền đầy đủ thông tin bên dưới. Hồ sơ sẽ được Admin xét duyệt trong vòng 3–5 ngày làm việc.
                    </p>
                </div>

                <form className="pt-register__form" onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    <div className="form-group avatar-upload">
                        <label>Ảnh Chân Dung <span className="required">*</span></label>
                        <div
                            className="avatar-preview-container"
                            onClick={() => document.getElementById("avatarInput")?.click()}
                            role="button"
                            aria-label="Chọn ảnh đại diện"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="avatar-preview" />
                            ) : (
                                <span className="avatar-placeholder">
                                    📷<br />Nhấn để chọn ảnh
                                </span>
                            )}
                        </div>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Họ tên + Email */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fullName">Họ và Tên <span className="required">*</span></label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email <span className="required">*</span></label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Số điện thoại + Giới tính */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Số Điện Thoại <span className="required">*</span></label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0901 234 567"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Giới Tính <span className="required">*</span></label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Chuyên môn + Kinh nghiệm */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="specialtyInput">
                                Chuyên Môn <span className="required">*</span>
                            </label>
                            <input
                                id="specialtyInput"
                                type="text"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                placeholder="Gym, Yoga, Boxing..."
                                required
                            />
                            <span className="field-hint">Phân cách bằng dấu phẩy</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="experience">Kinh Nghiệm (năm) <span className="required">*</span></label>
                            <input
                                id="experience"
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Ví dụ: 3"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Giới thiệu */}
                    <div className="form-group">
                        <label htmlFor="bio">Giới Thiệu Bản Thân</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Chia sẻ kinh nghiệm, thành tích, phong cách huấn luyện của bạn..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" /> Đang xử lý...
                            </span>
                        ) : (
                            "Gửi Đơn Đăng Ký"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PTRegisterPage;