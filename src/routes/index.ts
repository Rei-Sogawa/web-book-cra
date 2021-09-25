import { generatePath } from 'react-router'

import AdminBookEditPage from '@/ui/AdminBookEditPage/Index'
import AdminBookNewPage from '@/ui/AdminBookNewPage/Index'
import AdminBooksPage from '@/ui/AdminBooksPage/Index'
import AdminBookViewerPage from '@/ui/AdminBookViewerPage/Index'
import AdminChapterEditPage from '@/ui/AdminChapterEditPage/Index'
import AdminHomePage from '@/ui/AdminHomePage/Index'
import AdminSignInPage from '@/ui/AdminSignInPage/Index'
import AdminSignUpPage from '@/ui/AdminSignUpPage/Index'
import BooksPage from '@/ui/BooksPage/Index'

import { Admin, AdminSignIn, Public } from './authenticate'

const basic = {
  exact: true,
}

export const routeMap = {
  '/': {
    ...basic,
    path: () => {
      return '/'
    },
    Component: Public(AdminHomePage),
  },

  '/books': {
    ...basic,
    path: () => {
      return '/books'
    },
    Component: Public(BooksPage),
  },

  '/admin/sign-in': {
    ...basic,
    path: () => {
      return '/admin/sign-in'
    },
    Component: AdminSignIn(AdminSignInPage),
  },

  '/admin/sign-up': {
    ...basic,
    path: () => {
      return '/admin/sign-up'
    },
    Component: AdminSignIn(AdminSignUpPage),
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
