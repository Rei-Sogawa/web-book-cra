import * as admin from "firebase-admin";

export type WithId<T> = T & { id: string }

export type Timestamp = admin.firestore.Timestamp
export type FieldValue = admin.firestore.FieldValue
