import * as firestore from 'firebase/firestore'

export type WithId<T> = T & { id: string }

export type Timestamp = firestore.Timestamp
export type FieldValue = firestore.FieldValue

export type TimestampOrFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp
    ? Timestamp | FieldValue
    : T[key] extends Timestamp | null
    ? Timestamp | null | FieldValue
    : T[key]
}

export const serverTimestamp = firestore.serverTimestamp
export const fromDate = firestore.Timestamp.fromDate
