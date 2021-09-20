import { Box, Link, Text, VStack } from '@chakra-ui/react'
import { orderBy } from 'firebase/firestore'
import { every } from 'lodash-es'
import { VFC } from 'react'
import { Link as ReactRouterLink, Route, Switch, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'

type BookViewerProps = {
  book: Book
  chapters: Chapter[]
}

const BookViewer: VFC<BookViewerProps> = ({ book, chapters }) => {
  const rootPath = routeMap['/admin/books/:bookId/viewer'].path({ bookId: book.id })
  const chapterPathTemplate = '/admin/books/:bookId/viewer/:chapterId'
  const chapterPath = (chapterId: string) => `${rootPath}/${chapterId}`

  return (
    <Box minH="100vh" display="flex">
      <VStack
        width="80"
        borderRight="1px"
        borderRightColor="gray.200"
        boxShadow="sm"
        py="2"
        px="4"
        spacing="4"
      >
        <Text alignSelf="start" fontWeight="bold" fontSize="2xl">
          Web Book
        </Text>

        <VStack alignSelf="stretch" alignItems="start">
          {chapters.map((chapter) => (
            <Link
              as={ReactRouterLink}
              to={chapterPath(chapter.id)}
              fontWeight="bold"
              color="gray.500"
              px="2"
            >
              {`${chapter.number.toString().padStart(2, '0')}. ${chapter.title}`}
            </Link>
          ))}
        </VStack>
      </VStack>

      <Route path={chapterPathTemplate} exact>
        <Box>HOGE</Box>
      </Route>
    </Box>
  )
}

const BookViewerContainer: VFC = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const [{ value: book }, fetchBook] = useAsyncFn(() => {
    return BookService.getDoc(bookId)
  })

  const [{ value: chapters }, fetchChapters] = useAsyncFn(() => {
    return ChapterService.getDocs({ bookId }, orderBy('number'))
  })

  useMount(() => {
    fetchBook()
    fetchChapters()
  })

  return <>{every([book, chapters], Boolean) && <BookViewer book={book!} chapters={chapters!} />}</>
}

export default BookViewerContainer
