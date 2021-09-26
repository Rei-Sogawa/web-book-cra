import { db } from "../firebaseApp";
import {createConvertor, WithId} from "../lib/firestore";

export type AdminData = {
  email: string
}

export type Admin = WithId<AdminData>

// ref
const adminConvertor = createConvertor<AdminData>()

export const adminsRef = () => {
  return db.collection("admins").withConverter(adminConvertor)
} 
export const adminRef = ({adminId}: {adminId: string}) => {
  return adminsRef().doc(adminId)
}
