import * as firestore from 'firebase/firestore'

// model
type WithId<T> = T & { id: string }

// firestore
type Timestamp = firestore.Timestamp

type FieldValue = firestore.FieldValue

type TimestampToFieldValue<T> = {
  [key in keyof T]: T[key] extends Timestamp ? FieldValue : T[key]
}

// react
type UseStateReturn<T> = [T, Dispatch<SetStateAction<T>>]
