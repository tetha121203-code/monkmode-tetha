import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useSync<T>(
  key: string,
  defaultValue: T,
  uid: string | null
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [val, setVal] = useState<T>(defaultValue);
  const [ready, setReady] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const defRef = useRef<T>(defaultValue);

  useEffect(() => {
    defRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (!uid) {
      setVal(defRef.current);
      setReady(true);
      return;
    }

    const docRef = doc(db, 'users', uid, 'data', key);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.val !== undefined) {
            setVal(data.val as T);
          }
        } else {
          setVal(defRef.current);
        }
        setReady(true);
      },
      (error) => {
        console.warn(`Firestore sync notice for ${key}:`, error);
        setVal(defRef.current);
        setReady(true);
      }
    );

    return () => unsubscribe();
  }, [uid, key]);

  const saveToFirestore = useCallback((v: T) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!uid) return;
      try {
        const docRef = doc(db, 'users', uid, 'data', key);
        await setDoc(docRef, { val: v, updatedAt: serverTimestamp() }, { merge: true });
      } catch (e) {
        console.error(`Error saving ${key} to Firestore:`, e);
      }
    }, 500);
  }, [uid, key]);

  const setValue = useCallback((updater: T | ((prev: T) => T)) => {
    setVal(prev => {
      const current = prev !== undefined ? prev : defRef.current;
      const next = typeof updater === 'function' ? (updater as (p: T) => T)(current) : updater;
      saveToFirestore(next);
      return next;
    });
  }, [saveToFirestore]);

  return [val, setValue, ready];
}
