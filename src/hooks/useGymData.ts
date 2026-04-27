import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GymInfo, Floor, Zone } from '../types/models';

export const useGymData = () => {
    const [loading, setLoading] = useState(true);
    const [gymInfo, setGymInfo] = useState<GymInfo | null>(null);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        const fetchAllGymData = async () => {
            try {
                setLoading(true);
                // 1. Lấy thông tin chung
                const gymSnap = await getDoc(doc(db, 'gym_info', 'main-gym'));

                // 2. Lấy danh sách tầng (Sắp xếp theo số tầng)
                const floorsQuery = query(collection(db, 'floors'), orderBy('floorNumber', 'asc'));
                const floorsSnap = await getDocs(floorsQuery);

                // 3. Lấy danh sách khu vực
                const zonesSnap = await getDocs(collection(db, 'zones'));

                if (gymSnap.exists()) {
                    console.log("Dữ liệu từ DB:", gymSnap.data()); // <--- Dòng này
                    setGymInfo({ id: gymSnap.id, ...gymSnap.data() } as GymInfo);
                } else {
                    console.log("Không tìm thấy Document với ID này!");
                }
                setFloors(floorsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Floor)));
                setZones(zonesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Zone)));
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Gym:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllGymData();
    }, []);

    return { gymInfo, floors, zones, loading };
};