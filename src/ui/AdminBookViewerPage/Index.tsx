import { Box } from '@chakra-ui/react'
import { every, head, last } from 'lodash-es'
import { VFC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { Book, Chapter } from '@/domain'

import { useAdminBookViewerQuery } from './application'
import { ChapterPage } from './ChapterPage'
import { Sidebar } from './Siderbar'

type BookViewerProps = {
  book: Book
  chapters: Chapter[]
}

const BookViewer: VFC<BookViewerProps> = ({ book, chapters }) => {
  const history = useHistory()

  const rootPathTemplate = '/admin/books/:bookId/viewer'
  const chapterPathTemplate = '/admin/books/:bookId/viewer/:chapterId'

  const lastPathname = last(history.location.pathname.split('/'))
  const currentChapter = chapters.find(({ id }) => id === lastPathname) || head(chapters)

  return (
    <Box display="flex">
      <Sidebar book={book} chapters={chapters} currentChapterId={currentChapter?.id} />

      <Switch>
        <Route path={rootPathTemplate}>
          {currentChapter && (
            <Box flex="1">
              <ChapterPage chapter={currentChapter} />
            </Box>
          )}
        </Route>

        <Route path={chapterPathTemplate} exact>
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
