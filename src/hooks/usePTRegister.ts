import { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadImageToImgBB } from "../services/uploadService";
import { PTApplication } from "../types/models";

export const usePTRegister = () => {
    // State theo đúng PTApplication model
    const [formData, setFormData] = useState<Omit<PTApplication, "id" | "status" | "createdAt" | "specialty">>({
        avatarUrl: "",
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        experience: "",
        bio: "",
    });

    const [specialtyInput, setSpecialtyInput] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // 1. Xử lý thay đổi input và chặn nhập sai định dạng ngay lập tức
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Kiểm tra riêng cho số điện thoại: Chỉ cho phép nhập số và tối đa 10 ký tự
        if (name === "phone") {
            const onlyNums = value.replace(/[^0-9]/g, "");
            if (onlyNums.length <= 10) {
                setFormData((prev) => ({ ...prev, [name]: onlyNums }));
            }
            return;
        }

        // Kiểm tra cho họ tên: Không cho phép nhập số ngay từ đầu (tùy chọn)
        if (name === "fullName") {
            const noNums = value.replace(/[0-9]/g, "");
            setFormData((prev) => ({ ...prev, [name]: noNums }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // 2. Hàm kiểm tra toàn bộ form trước khi gửi (Validation)
    const validateForm = (): boolean => {
        // Kiểm tra họ tên (ít nhất 2 từ)
        if (formData.fullName.trim().split(" ").length < 2) {
            alert("Vui lòng nhập đầy đủ họ và tên!");
            return false;
        }

        // Kiểm tra Email bằng Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Email không hợp lệ! Ví dụ: pt-gym@example.com");
            return false;
        }

        // Kiểm tra số điện thoại (phải đủ 10 số)
        if (formData.phone.length !== 10) {
            alert("Số điện thoại phải bao gồm đúng 10 chữ số!");
            return false;
        }

        // Kiểm tra kinh nghiệm (0 - 50 năm)
        const exp = parseInt(formData.experience);
        if (isNaN(exp) || exp < 0 || exp > 50) {
            alert("Số năm kinh nghiệm phải từ 0 đến 50!");
            return false;
        }

        // Kiểm tra Bio (Ít nhất 20 ký tự)
        if (formData.bio.trim().length < 20) {
            alert("Phần giới thiệu bản thân cần ít nhất 20 ký tự để hồ sơ chuyên nghiệp hơn.");
            return false;
        }

        return true;
    };

    // 3. Xử lý gửi form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra logic trước
        if (!validateForm()) return;

        // Kiểm tra ảnh
        if (!imageFile) {
            alert("Vui lòng chọn ảnh chân dung!");
            return;
        }

        setLoading(true);

        try {
            // Bước A: Upload ảnh lên imgBB
            const imageUrl = await uploadImageToImgBB(imageFile);
            if (!imageUrl) throw new Error("Không thể tải ảnh lên imgBB. Vui lòng kiểm tra kết nối.");

            // Bước B: Xử lý mảng chuyên môn
            const specialtyArray: string[] = specialtyInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            if (specialtyArray.length === 0) {
                alert("Vui lòng nhập ít nhất một chuyên môn (ví dụ: Gym, Yoga).");
                setLoading(false);
                return;
            }

            // Bước C: Chuẩn bị dữ liệu cuối cùng
            const application: Omit<PTApplication, "id"> = {
                ...formData,
                avatarUrl: imageUrl, // Đảm bảo lưu link ảnh từ imgBB
                specialty: specialtyArray,
                status: "pending",
                createdAt: serverTimestamp(),
            };

            // Bước D: Lưu vào Firestore
            await addDoc(collection(db, "pt_applications"), application);
            setSubmitted(true);
        } catch (error: any) {
            console.error("Lỗi quá trình đăng ký:", error);
            alert("Lỗi: " + (error.message || "Không thể gửi đơn đăng ký."));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        specialtyInput,
        setSpecialtyInput,
        imagePreview,
        loading,
        submitted,
        handleChange,
        handleFileChange,
        handleSubmit,
    };
};