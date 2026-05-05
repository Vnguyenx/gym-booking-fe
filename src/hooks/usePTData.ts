import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PT } from '../types/models';

export const usePTData = () => {
    const [pts, setPts] = useState<PT[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPTs = async () => {
            try {
                setLoading(true);
                // Trỏ thẳng vào collection 'pts' - Nơi chứa hồ sơ chuẩn của PT
                const querySnapshot = await getDocs(collection(db, 'pts'));

                const ptsData: PT[] = [];
                querySnapshot.forEach((doc) => {
                    ptsData.push({ id: doc.id, ...doc.data() } as PT);
                });

                setPts(ptsData);
            } catch (error) {
                console.error("Lỗi khi tải danh sách PT từ bảng pts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPTs();
    }, []);

    return { pts, loading };
};