import { ComponentType } from 'react'
import { Redirect } from 'react-router'

import { useAuth } from '@/service/auth'

import { routeMap } from '.'

export const Public =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Component {...props} />
  }

export const Admin =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Component {...props} />
  }

export const AdminSignIn =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid } = useAuth()
      if (uid) return <Redirect to={routeMap['/admin/books'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }
