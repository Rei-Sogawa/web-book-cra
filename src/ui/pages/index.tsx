import { VFC } from 'react'
import { Redirect } from 'react-router-dom'

import { routeMap } from '@/routes'

const IndexPage: VFC = () => {
  return <Redirect to={routeMap['/admin/books'].path()} />
}

export default IndexPage
