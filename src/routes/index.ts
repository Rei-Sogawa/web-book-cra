import { generatePath } from 'react-router'

import { Admin, Public } from '@/routes/authenticate'
import AdminBookEditPage from '@/ui/AdminBookEditPage/Index'
import AdminBookNewPage from '@/ui/AdminBookNewPage/Index'
import AdminBooksPage from '@/ui/AdminBooksPage/Index'
import AdminBookViewerPage from '@/ui/AdminBookViewerPage/Index'
import AdminChapterEditPage from '@/ui/AdminChapterEditPage/Index'
import HomePage from '@/ui/HomePage/Index'

const basic = {
  exact: true,
}

export const routeMap = {
  '/': {
    ...basic,
    path: () => {
      return '/'
    },
    Component: Public(HomePage),
  },

  '/admin/books': {
    ...basic,
    path: () => {
      return '/admin/books'
    },
    Component: Admin(AdminBooksPage),
  },

  '/admin/books/new': {
    ...basic,
    path: () => {
      return '/admin/books/new'
    },
    Component: Admin(AdminBookNewPage),
  },

  '/admin/books/:bookId/edit': {
    ...basic,
    path: ({ bookId }: { bookId: string }) => {
      return generatePath('/admin/books/:bookId/edit', { bookId })
    },
    Component: Admin(AdminBookEditPage),
  },

  '/admin/books/:bookId/viewer': {
    ...basic,
    path: ({ bookId }: { bookId: string }) => {
      return generatePath('/admin/books/:bookId/viewer', { bookId })
    },
    Component: Admin(AdminBookViewerPage),
    exact: false,
  },

  '/admin/books/:bookId/chapters/:chapterId/edit': {
    ...basic,
    path: ({ bookId, chapterId }: { bookId: string; chapterId: string }) => {
      return generatePath('/admin/books/:bookId/chapters/:chapterId/edit', { bookId, chapterId })
    },
    Component: Admin(AdminChapterEditPage),
  },
}

export const pathTemplates = Object.keys(routeMap) as (keyof typeof routeMap)[]
