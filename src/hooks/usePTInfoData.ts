import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PTInfo } from '../types/models';

export const usePTInfoData = () => {
    // State lưu trữ dữ liệu PT Info
    const [ptInfo, setPtInfo] = useState<PTInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPTInfo = async () => {
            try {
                setLoading(true);
                // Trỏ thẳng đến document 'main-pt' trong collection 'pt_info'
                const docRef = doc(db, 'pt_info', 'main-pt');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Ép kiểu dữ liệu trả về theo interface PTInfo
                    setPtInfo({ id: docSnap.id, ...docSnap.data() } as PTInfo);
                } else {
                    setError("Không tìm thấy thông tin PT");
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu PT Info:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false); // Hoàn thành việc tải
            }
        };

        fetchPTInfo();
    }, []);

    // Trả về data, trạng thái loading và error để component khác sử dụng
    return { ptInfo, loading, error };
};