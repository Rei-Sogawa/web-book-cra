import { generatePath } from 'react-router'

import AdminBookEditPage from '@/ui/AdminBookEditPage/Index'
import AdminBookNewPage from '@/ui/AdminBookNewPage/Index'
import AdminBooksPage from '@/ui/AdminBooksPage/Index'
import AdminBookViewerPage from '@/ui/AdminBookViewerPage/Index'
import AdminChapterEditPage from '@/ui/AdminChapterEditPage/Index'
import AdminHomePage from '@/ui/AdminHomePage/Index'
import AdminSignInPage from '@/ui/AdminSignInPage/Index'
import AdminSignUpPage from '@/ui/AdminSignUpPage/Index'
import BookShowPage from '@/ui/BookShowPage/Index'
import BooksPage from '@/ui/BooksPage/Index'
import BookViewerPage from '@/ui/BookViewerPage/Index'
import CartPage from '@/ui/CartPage/Index'
import MyPage from '@/ui/MyPage/Index'
import SignInPage from '@/ui/SignInPage/Index'
import SignUpPage from '@/ui/SignUpPage/Index'

import { Admin, AdminSignIn, Public, SignIn } from './authenticate'

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

  '/sign-in': {
    ...basic,
    path: () => {
      return '/sign-in'
    },
    Component: SignIn(SignInPage),
  },

  '/sign-up': {
    ...basic,
    path: () => {
      return '/sign-up'
    },
    Component: SignIn(SignUpPage),
  },

  '/books': {
    ...basic,
    path: () => {
      return '/books'
    },
    Component: Public(BooksPage),
  },

  '/books/:bookId': {
    ...basic,
    path: ({ bookId }: { bookId: string }) => {
      return generatePath('/books/:bookId', { bookId })
    },
    Component: Public(BookShowPage),
  },

  '/books/:bookId/viewer': {
    ...basic,
    path: ({ bookId }: { bookId: string }) => {
      return generatePath('/books/:bookId/viewer', { bookId })
    },
    Component: Public(BookViewerPage),
    exact: false,
  },

  '/cart': {
    ...basic,
    path: () => {
      return generatePath('/cart')
    },
    Component: Public(CartPage),
  },

  '/my-page': {
    ...basic,
    path: () => {
      return generatePath('/my-page')
    },
    Component: Public(MyPage),
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

  '/admin': {
    ...basic,
    path: () => {
      return '/admin'
    },
    Component: Admin(AdminBooksPage),
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
