import { firestore } from 'firebase-admin'

export type WithId<T> = T & { id: string }

export type Timestamp = firestore.Timestamp

export type FieldValue = firestore.FieldValue

export type Primitive = string | number | boolean | undefined | null

export type PartialWithFieldValue<T> = T extends Primitive
  ? T
  : T extends {}
  ? {
      [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue
    }
  : Partial<T>

export type WithFieldValue<T> = T extends Primitive
  ? T
  : T extends {}
  ? { [K in keyof T]: WithFieldValue<T[K]> | FieldValue }
  : Partial<T>

export const convertor = <T>(): firestore.FirestoreDataConverter<T> => ({
  toFirestore: (data: T | Partial<T>) => data,
  fromFirestore: (snap) => snap.data() as T,
})

export const fetchDoc = async <T>(docRef: firestore.DocumentReference) => {
  const docSnap = await docRef.get()
  return { id: docSnap.id, ...docSnap.data() } as WithId<T>
}

export const fetchDocs = async <T>(query: firestore.Query) => {
  const queryRef = await query.get()
  return queryRef.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WithId<T>))
}
