import * as functions from 'firebase-functions'
import { WithId } from './firestore'

export const howDocWritten = <T>(
  change: functions.Change<functions.firestore.DocumentSnapshot>
) => {
  const { before, after } = change
  const beforeModel = { id: before.id, ...before.data() } as WithId<T>
  const afterModel = { id: after.id, ...after.data() } as WithId<T>

  return {
    onCreate: !before.exists && after.exists,
    onUpdate: before.exists && after.exists,
    onDelete: before.exists && !after.exists,
    beforeModel,
    afterModel,
  }
}

export const docSnapToModel = <T>(docSnap: functions.firestore.DocumentSnapshot) => {
  return { id: docSnap.id, ...docSnap.data() } as WithId<T>
}
