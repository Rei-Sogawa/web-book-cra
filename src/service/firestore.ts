import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  query,
  QueryConstraint,
  updateDoc,
} from 'firebase/firestore'
import { DependencyList, useEffect, useState } from 'react'

import { db } from '@/firebaseApp'
import { TimestampOrFieldValue, WithId } from '@/lib/firestore'

export const createFirestoreService = <Data, PathParams>(
  getCollectionPath: (pathParams: PathParams) => string
) => {
  const getCollectionRef = (pathParams: PathParams) => collection(db, getCollectionPath(pathParams))

  const getDocRef = (id: string, pathParams: PathParams) =>
    doc(db, getCollectionPath(pathParams), id)

  const _getDoc = async (id: string, pathParams: PathParams) => {
    const docSnap = await getDoc(getDocRef(id, pathParams))
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as WithId<Data>) : undefined
  }

  const _getDocs = async (pathParams: PathParams, ...queryConstraints: QueryConstraint[]) => {
    const querySnap = await getDocs(
      queryConstraints.length
        ? query(getCollectionRef(pathParams), ...queryConstraints)
        : getCollectionRef(pathParams)
    )
    return querySnap.empty
      ? undefined
      : querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WithId<Data>))
  }

  const _createDoc = (newData: Data | TimestampOrFieldValue<Data>, pathParams: PathParams) => {
    return addDoc<DocumentData>(getCollectionRef(pathParams), newData)
  }

  const _updateDoc = (
    editedData: Partial<Data | TimestampOrFieldValue<Data>>,
    id: string,
    pathParams: PathParams
  ) => {
    return updateDoc<DocumentData>(getDocRef(id, pathParams), editedData)
  }

  const _deleteDoc = (id: string, pathParams: PathParams) => {
    return deleteDoc(getDocRef(id, pathParams))
  }

  return {
    getDoc: _getDoc,
    getDocs: _getDocs,
    createDoc: _createDoc,
    updateDoc: _updateDoc,
    deleteDoc: _deleteDoc,
    getCollectionRef,
    getDocRef,
  }
}

export const useSubscribeCollection = <T extends { id: string }>(
  query: Query,
  deps: DependencyList = []
) => {
  const [initialized, setInitialize] = useState(false)
  const [values, setValues] = useState<T[]>()

  useEffect(() => {
    const unsubscirbe = onSnapshot(query, (snap) => {
      if (!initialized) setInitialize(true)

      if (snap.empty) {
        setValues(undefined)
      } else {
        setValues(
          snap.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data({ serverTimestamps: 'estimate' }),
              } as T)
          )
        )
      }
    })
    return unsubscirbe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { initialized, values }
}

export const useSubscribeDoc = <T extends { id: string }>(
  docRef: DocumentReference,
  deps: DependencyList = []
) => {
  const [initialized, setInitialize] = useState(false)
  const [value, setValue] = useState<T>()

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (!initialized) setInitialize(true)

      if (snap.exists()) {
        setValue({ id: snap.id, ...snap.data() } as T)
      } else {
        setValue(undefined)
      }
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { initialized, value }
}

export const convertor = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data as T,
  fromFirestore: (snap, options) => snap.data(options) as T,
})
