import { Link, LinkProps } from '@chakra-ui/react'
import { VFC } from 'react'
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom'

type AppLinkProps = { to: ReactRouterLinkProps['to'] } & LinkProps

export const AppLink: VFC<AppLinkProps> = ({ to, ...props }) => {
  return <Link as={ReactRouterLink} to={to} {...props} />
}
