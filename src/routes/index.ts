import { generatePath } from 'react-router'

import { Admin, Public } from '@/routes/authenticate'
import IndexPage from '@/ui/pages'
import BooksPage from '@/ui/pages/admin/books'
import ChapterEditPage from '@/ui/pages/admin/books/[bookId]/chapters/[chapterId]/edit'
import BookEditPage from '@/ui/pages/admin/books/[bookId]/edit'
import BookNewPage from '@/ui/pages/admin/books/new'

export const routeMap = {
  '/': { path: () => '/', Component: Public(IndexPage) },
  '/admin/books': { path: () => '/admin/books', Component: Admin(BooksPage) },
  '/admin/books/new': {
    path: () => '/admin/books/new',
    Component: Admin(BookNewPage),
  },
  '/admin/books/:bookId/edit': {
    path: ({ bookId }: { bookId: string }) => generatePath('/admin/books/:bookId/edit', { bookId }),
    Component: Admin(BookEditPage),
  },
  '/admin/books/:bookId/chapters/:chapterId/edit': {
    path: ({ bookId, chapterId }: { bookId: string; chapterId: string }) =>
      generatePath('/admin/books/:bookId/chapters/:chapterId/edit', { bookId, chapterId }),
    Component: Admin(ChapterEditPage),
  },
}

export const pathTemplates = Object.keys(routeMap) as (keyof typeof routeMap)[]
