import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Equipment } from '../types/models';

interface UseEquipmentDataReturn {
    equipment: Equipment[];
    loading: boolean;
    error: string | null;
}

const useEquipmentData = (gymId: string = 'main-gym'): UseEquipmentDataReturn => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading]     = useState<boolean>(true);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            setError(null);

            try {
                const q = query(
                    collection(db, 'equipment'),
                    where('gymId', '==', gymId),
                    orderBy('updatedAt', 'desc')
                );

                const snapshot = await getDocs(q);

                const data: Equipment[] = snapshot.docs.map(doc => {
                    const raw = doc.data();
                    return {
                        id:           doc.id,
                        category:     raw.category     ?? '',
                        subCategory:  raw.subCategory  ?? '',
                        name:         raw.name         ?? '',
                        nameVi:       raw.nameVi       ?? '',
                        description:  raw.description  ?? '',
                        tips:         raw.tips         ?? '',
                        floorId:      raw.floorId      ?? '',
                        gymId:        raw.gymId        ?? '',
                        zoneId:       raw.zoneId       ?? '',
                        imageUrls:    raw.imageUrls    ?? [],
                        isActive:     raw.isActive     ?? true,
                        quantity:     raw.quantity     ?? 0,
                        muscleGroups: raw.muscleGroups ?? [],
                        // Convert Firestore Timestamp → JS Date
                        updatedAt: raw.updatedAt instanceof Timestamp
                            ? raw.updatedAt.toDate()
                            : new Date(raw.updatedAt ?? Date.now()),
                    } satisfies Equipment;
                });

                setEquipment(data);
            } catch (err) {
                console.error('[useEquipmentData]', err);
                setError('Không thể tải dữ liệu thiết bị. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [gymId]);

    return { equipment, loading, error };
};

export default useEquipmentData;