import {WithId} from "../lib/firestore";

export type AdminData = {
  email: string
}

export type Admin = WithId<AdminData>
