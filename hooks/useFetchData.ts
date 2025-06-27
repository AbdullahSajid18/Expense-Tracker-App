
import { firestore } from '@/config/firebase';
import { collection, onSnapshot, query, QueryConstraint } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const useFetchData = <T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        if(!collectionName) return;
        const collectionRef = collection(firestore, collectionName);
        const q = query(collectionRef, ...constraints);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            }) as T[];
            setData(fetchedData);
            setLoading(false);

        }, (error) => {
            console.log('Error fetching data', error);
            setError(error.message);
            setLoading(false)
        });

        return () => unsubscribe();
    }, []) 
  return {
    data, loading, error
  }
}

export default useFetchData

const styles = StyleSheet.create({})