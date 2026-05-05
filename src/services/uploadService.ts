// src/services/uploadService.ts

export const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const apiKey = process.env.REACT_APP_IMGBB_API_KEY;

    // 1. Tạo FormData để đóng gói file ảnh
    const formData = new FormData();
    formData.append("image", file);

    try {
        // 2. Gửi request đến API của imgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            // Trả về link ảnh trực tiếp (direct link)
            return result.data.url;
        } else {
            console.error("Lỗi từ imgBB:", result.error.message);
            return null;
        }
    } catch (error) {
        console.error("Lỗi kết nối API imgBB:", error);
        return null;
    }
};