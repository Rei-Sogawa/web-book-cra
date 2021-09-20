import { ComponentType } from 'react'
import { Redirect } from 'react-router-dom'

import { routeMap } from '@/routes'

export const Public =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Redirect to={routeMap['/admin/books'].path()} />
    // return <Component {...props} />
  }

export const Admin =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Component {...props} />
  }
