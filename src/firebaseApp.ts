import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB_Q7fr5MxF2xkVjzIVzzOevflKcEKXRwE',
  authDomain: 'web-book-cra.firebaseapp.com',
  projectId: 'web-book-cra',
  storageBucket: 'web-book-cra.appspot.com',
  messagingSenderId: '758062793732',
  appId: '1:758062793732:web:7e8866e39b8a2722292151',
  measurementId: 'G-RW6T4RTY2P',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
}
