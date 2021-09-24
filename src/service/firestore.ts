import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  SnapshotOptions,
} from 'firebase/firestore'
import { DependencyList, useEffect, useState } from 'react'

const snapshotOptions: SnapshotOptions = { serverTimestamps: 'estimate' }

export const useSubscribeCollection = <T>(query: Query<T>, deps: DependencyList = []) => {
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
            ...(doc.data(snapshotOptions) as T),
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

export const useSubscribeDoc = <T>(docRef: DocumentReference<T>, deps: DependencyList = []) => {
  const [initialized, setInitialize] = useState(false)
  const [value, setValue] = useState<{ id: string } & T>()

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setValue({ id: snap.id, ...(snap.data(snapshotOptions) as T) })
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

export const fetchDocs = async <T>(query: Query<T>) => {
  const snap = await getDocs(query)
  if (snap.empty) {
    return undefined
  } else {
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data(snapshotOptions) as T),
    }))
  }
}

export const fetchDoc = async <T>(docRef: DocumentReference<T>) => {
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as T) }
  } else {
    return undefined
  }
}

export const convertor = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data as DocumentData,
  fromFirestore: (snap, options) => snap.data(options) as T,
})
