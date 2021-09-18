import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  Query,
  updateDoc,
} from 'firebase/firestore'
import { DependencyList, useEffect, useState } from 'react'

import { db } from '@/firebaseApp'
import { TimestampToFieldValue, WithId } from '@/types'

export const createFirestoreService = <Data, PathParams = void>({
  getPath,
  getDefaultData,
}: {
  getPath: (params: PathParams) => string
  getDefaultData: () => TimestampToFieldValue<Data>
}) => {
  const getCollectionRef = (params: PathParams) => collection(db, getPath(params))

  const getDocRef = (id: string, params: PathParams) => doc(db, getPath(params), id)

  const _getDoc = async (id: string, params: PathParams) => {
    const docSnap = await getDoc(getDocRef(id, params))
    return { id: docSnap.id, ...docSnap.data() } as WithId<Data>
  }

  const _createDoc = (newData: Partial<Data | TimestampToFieldValue<Data>>, params: PathParams) => {
    return addDoc(getCollectionRef(params), { ...getDefaultData(), ...newData })
  }

  const _updateDoc = (
    editedData: Partial<Data | TimestampToFieldValue<Data>>,
    id: string,
    params: PathParams
  ) => {
    return updateDoc<DocumentData>(getDocRef(id, params), editedData)
  }

  const _deleteDoc = (id: string, params: PathParams) => {
    return deleteDoc(getDocRef(id, params))
  }

  return {
    getDoc: _getDoc,
    createDoc: _createDoc,
    updateDoc: _updateDoc,
    deleteDoc: _deleteDoc,
    getCollectionRef,
    getDocRef,
  }
}

export const useSubscribeCollection = <Data>({
  query,
  deps = [],
}: {
  query: Query
  deps?: DependencyList
}) => {
  const [values, setValues] = useState<WithId<Data>[]>()

  useEffect(() => {
    const unsubscirbe = onSnapshot(query, (snap) => {
      setValues(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data({ serverTimestamps: 'estimate' }) as Data),
        }))
      )
    })
    return unsubscirbe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return values
}

export const useSubscribeDoc = <Data>({
  docRef,
  deps = [],
}: {
  docRef: DocumentReference
  deps: DependencyList
}) => {
  const [value, setValue] = useState<WithId<Data>>()

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      setValue({ id: snap.id, ...(snap.data() as Data) })
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return value
}
