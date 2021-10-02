import { ComponentType } from 'react'
import { Redirect } from 'react-router'

import { useAuth } from '@/service/auth'

import { routeMap } from '.'

export const Public =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    return <Component {...props} />
  }

export const User =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid, user } = useAuth()

      if (!(uid && user)) return <Redirect to={routeMap['/sign-in'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }

export const SignIn =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid, user } = useAuth()
      console.log(uid, user)
      if (uid && user) return <Redirect to={routeMap['/books'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }

export const Admin =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid, admin } = useAuth()

      if (!(uid && admin)) return <Redirect to={routeMap['/admin/sign-in'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }

export const AdminSignIn =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid, admin } = useAuth()

      if (uid && admin) return <Redirect to={routeMap['/admin/books'].path()} />
      return <Component {...props} />
    }

    return WithStateComponent()
  }
