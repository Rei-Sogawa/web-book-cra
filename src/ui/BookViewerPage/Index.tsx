import { Box } from '@chakra-ui/react'
import { every, last } from 'lodash-es'
import { VFC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'

import { useBookViewerQuery } from './container'
import { Sidebar } from './Siderbar'
import { ViewerPage } from './ViewerPage'
import { ViewerShowPage } from './ViewerShowPage'

const VIEWER_PATH = '/books/:bookId/viewer'
const VIEWER_SHOW_PATH = '/books/:bookId/viewer/:chapterId'

type BookViewerProps = {
  book: Book
  chapters: Chapter[]
}

const BookViewer: VFC<BookViewerProps> = ({ book, chapters }) => {
  // app
  const history = useHistory()
  const lastPathname = last(history.location.pathname.split('/'))

  // container
  const currentChapter = chapters.find(({ id }) => id === lastPathname)

  return (
    <Box display="flex">
      <Sidebar book={book} chapters={chapters} currentChapterId={currentChapter?.id} />

      <Switch>
        <Route path={VIEWER_PATH} exact>
          {!currentChapter && (
            <Box flex="1">
              <ViewerPage book={book} />
            </Box>
          )}
        </Route>

        <Route path={VIEWER_SHOW_PATH} exact>
          {currentChapter && (
            <Box flex="1">
              <ViewerShowPage chapter={currentChapter} />
            </Box>
          )}
        </Route>
      </Switch>
    </Box>
  )
}

const Wrapper: VFC = () => {
  const { book, chapters } = useBookViewerQuery()

  return <>{every([book, chapters], Boolean) && <BookViewer book={book!} chapters={chapters!} />}</>
}

export default Wrapper
