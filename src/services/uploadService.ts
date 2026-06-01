// src/services/uploadService.ts

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset!);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
        );
        const result = await response.json();
        if (result.secure_url) {
            return result.secure_url;
        } else {
            console.error("Lỗi từ Cloudinary:", result);
            return null;
        }
    } catch (error) {
        console.error("Lỗi kết nối Cloudinary:", error);
        return null;
    }
};