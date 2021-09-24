import * as firestore from 'firebase/firestore'

export type WithId<T> = T & { id: string }

export type Timestamp = firestore.Timestamp
export type FieldValue = firestore.FieldValue
