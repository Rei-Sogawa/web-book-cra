import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
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
import { TimestampToFieldValue, WithId } from '@/types'

export const createFirestoreService = <Data, PathParams>({
  getDefaultData,
  getCollectionPath,
}: {
  getDefaultData: () => TimestampToFieldValue<Data>
  getCollectionPath: (pathParams: PathParams) => string
}) => {
  const getCollectionRef = (pathParams: PathParams) => collection(db, getCollectionPath(pathParams))

  const getDocRef = (id: string, pathParams: PathParams) =>
    doc(db, getCollectionPath(pathParams), id)

  const _getDoc = async (id: string, pathParams: PathParams) => {
    const docSnap = await getDoc(getDocRef(id, pathParams))
    return { id: docSnap.id, ...docSnap.data() } as WithId<Data>
  }

  const _getDocs = async (pathParams: PathParams, ...queryConstraints: QueryConstraint[]) => {
    const querySnap = await getDocs(
      queryConstraints.length
        ? query(getCollectionRef(pathParams), ...queryConstraints)
        : getCollectionRef(pathParams)
    )
    return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WithId<Data>))
  }

  const _createDoc = (
    newData: Partial<Data | TimestampToFieldValue<Data>>,
    pathParams: PathParams
  ) => {
    return addDoc(getCollectionRef(pathParams), { ...getDefaultData(), ...newData })
  }

  const _updateDoc = (
    editedData: Partial<Data | TimestampToFieldValue<Data>>,
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

export const useSubscribeCollection = <Data>(query: Query, deps: DependencyList = []) => {
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

export const useSubscribeDoc = <Data>(docRef: DocumentReference, deps: DependencyList = []) => {
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
