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
    const WithStateComponent = () => {
      const { uid, currentAdmin } = useAuth()

      if (!(uid && currentAdmin)) return <Redirect to={routeMap['/admin/sign-in'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }

export const AdminSignIn =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid, currentAdmin } = useAuth()

      if (uid && currentAdmin) return <Redirect to={routeMap['/admin/books'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }
