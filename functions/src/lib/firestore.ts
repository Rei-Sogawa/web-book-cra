import { firestore } from "firebase-admin"

export type WithId<T> = T & {id: string}

export const convertor = <T>(): firestore.FirestoreDataConverter<T> => ({
  toFirestore: (data) => data,
  fromFirestore: (snap) => snap.data() as T,
})
