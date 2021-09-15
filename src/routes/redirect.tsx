import { ComponentType } from 'react'

export const Public =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Component {...props} />
  }
