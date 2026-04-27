import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase'; // Bạn nhớ tạo file config này

export const useFirestore = <T>(collectionName: string, activeOnly: boolean = false) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let q = query(collection(db, collectionName), orderBy('order', 'asc'));

        if (activeOnly) {
            q = query(collection(db, collectionName),
                where('isActive', '==', true),
                orderBy('order', 'asc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const result = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as T[];
            setData(result);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName, activeOnly]);

    return { data, loading };
};