import { db } from "../firebaseApp";
import { createConvertor, WithId } from "../lib/firestore";

// schema
export type UserData = {
  email: string
}

export type User = WithId<UserData>

// ref
const userConvertor = createConvertor<UserData>()

export const usersRef = () => {
  return db.collection("users").withConverter(userConvertor)
}
export const userRef = ({userId}:{userId:string}) => {
  return usersRef().doc(userId)
}
