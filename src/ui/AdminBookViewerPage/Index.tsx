import { Box, Container, Divider, HStack, Text, VStack } from '@chakra-ui/react'
import { every, last } from 'lodash-es'
import { VFC } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { useMarked } from '@/hooks/useMarked'
import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'

import { BookImage } from '../Shared/BookImage'
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
  const currentChapter = chapters.find(({ id }) => id === lastPathname)

  // ui
  const markedDescription = useMarked(book.description)

  return (
    <Box display="flex">
      <Sidebar book={book} chapters={chapters} currentChapterId={currentChapter?.id} />

      <Switch>
        <Route path={VIEWER_PATH} exact>
          {!currentChapter && (
            <Box flex="1">
              <Box maxH="100vh" overflow="auto">
                <Container maxW="container.md" py="8">
                  <HStack alignItems="start" spacing="8">
                    <Box>
                      <BookImage imageUrl={book.image?.url} size="md" />
                    </Box>

                    <VStack alignItems="start">
                      <Box>
                        <Text fontWeight="bold" fontSize="2xl">
                          {book.title}
                        </Text>
                        <Text>{book.authorNames.join(', ')}</Text>
                      </Box>

                      <Divider />

                      <Box
                        className="markdown-body"
                        dangerouslySetInnerHTML={{ __html: markedDescription }}
                      />
                    </VStack>
                  </HStack>
                </Container>
              </Box>
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
