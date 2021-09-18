import { initializeApp } from 'firebase/app'
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

export const storage = getStorage(app)
connectStorageEmulator(storage, 'localhost', 9199)
