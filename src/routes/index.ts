import { Public } from '@/routes/redirect'
import IndexPage from '@/ui/pages'

export const routeMap = {
  '/': { path: () => '/', Component: Public(IndexPage) },
}

export const pathTemplates = Object.keys(routeMap) as (keyof typeof routeMap)[]
