import * as functions from 'firebase-functions'
import { WithId } from './firestore'

export const docSnapToModel = <T>(docSnap: functions.firestore.DocumentSnapshot) => {
  return { id: docSnap.id, ...docSnap.data() } as WithId<T>
}

export const onWrittenConvertor = <T>(
  change: functions.Change<functions.firestore.DocumentSnapshot>
) => {
  const { before, after } = change
  const beforeModel = docSnapToModel<T>(before)
  const afterModel = docSnapToModel<T>(after)

  return {
    onCreate: !before.exists && after.exists,
    onUpdate: before.exists && after.exists,
    onDelete: before.exists && !after.exists,
    beforeModel,
    afterModel,
  }
}
