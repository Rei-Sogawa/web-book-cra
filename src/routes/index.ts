import { generatePath } from 'react-router'

import { Admin, Public } from '@/routes/redirectHOCs'
import IndexPage from '@/ui/pages'
import ChapterEditPage from '@/ui/pages/admin/books/[bookId]/chapters/[chapterId]/edit'

export const routeMap = {
  '/': { path: () => '/', Component: Public(IndexPage) },
  '/admin/books/:bookId/chapters/:chapterId/edit': {
    path: ({ bookId, chapterId }: { bookId: string; chapterId: string }) =>
      generatePath('/admin/books/:bookId/chapters/:chapterId/edit', { bookId, chapterId }),
    Component: Admin(ChapterEditPage),
  },
}

export const pathTemplates = Object.keys(routeMap) as (keyof typeof routeMap)[]
