import { Dispatch, SetStateAction } from 'react'

// react
export type UseStateReturn<T> = [T, Dispatch<SetStateAction<T>>]
