import { Box } from '@chakra-ui/react'
import { every, head, last } from 'lodash-es'
import { VFC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'

import { ChapterPage } from './ChapterPage'
import { useAdminBookViewerQuery } from './container'
import { Sidebar } from './Siderbar'

const VIEWER_PATH = '/admin/books/:bookId/viewer'
const VIEWER_SHOW_PATH = '/admin/books/:bookId/viewer/:chapterId'

type BookViewerProps = {
  book: Book
  chapters: Chapter[]
}

const BookViewer: VFC<BookViewerProps> = ({ book, chapters }) => {
  // app
  const history = useHistory()
  const lastPathname = last(history.location.pathname.split('/'))

  // container
  const currentChapter = chapters.find(({ id }) => id === lastPathname) || head(chapters)

  return (
    <Box display="flex">
      <Sidebar book={book} chapters={chapters} currentChapterId={currentChapter?.id} />

      <Switch>
        <Route path={VIEWER_PATH}>
          {currentChapter && (
            <Box flex="1">
              <ChapterPage chapter={currentChapter} />
            </Box>
          )}
        </Route>

        <Route path={VIEWER_SHOW_PATH} exact>
          {currentChapter && (
            <Box flex="1">
              <ChapterPage chapter={currentChapter} />
            </Box>
          )}
        </Route>
      </Switch>
    </Box>
  )
}

const Wrapper: VFC = () => {
  const { book, chapters } = useAdminBookViewerQuery()

  return <>{every([book, chapters], Boolean) && <BookViewer book={book!} chapters={chapters!} />}</>
}

export default Wrapper
