import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  onSnapshot,
  Query,
} from 'firebase/firestore'
import { DependencyList, useEffect, useState } from 'react'

export const useSubscribeCollection = <T>(query: Query, deps: DependencyList = []) => {
  const [initialized, setInitialize] = useState(false)
  const [values, setValues] = useState<({ id: string } & T)[]>()

  useEffect(() => {
    const unsubscirbe = onSnapshot(query, (snap) => {
      if (snap.empty) {
        setValues(undefined)
      } else {
        setValues(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data({ serverTimestamps: 'estimate' }) as T),
          }))
        )
      }

      if (!initialized) setInitialize(true)
    })
    return unsubscirbe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { initialized, values }
}

export const useSubscribeDoc = <T>(docRef: DocumentReference, deps: DependencyList = []) => {
  const [initialized, setInitialize] = useState(false)
  const [value, setValue] = useState<{ id: string } & T>()

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setValue({ id: snap.id, ...(snap.data({ serverTimestamps: 'estimate' }) as T) })
      } else {
        setValue(undefined)
      }

      if (!initialized) setInitialize(true)
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { initialized, value }
}

export const convertor = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data as DocumentData,
  fromFirestore: (snap, options) => snap.data(options) as T,
})
