import { Box, Container, HStack, Image, Link, Text, VStack } from '@chakra-ui/react'
import { orderBy } from 'firebase/firestore'
import { every, head, last } from 'lodash-es'
import { VFC } from 'react'
import { Link as ReactRouterLink, Route, Switch, useHistory, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { useMarked } from '@/hooks/useMarked'
import { routeMap } from '@/routes'
import { BookService, ChapterService } from '@/service/firestore'

type ViewerProps = {
  chapter: Chapter
}

const Viewer: VFC<ViewerProps> = ({ chapter }) => {
  const markedContent = useMarked(chapter.content)

  return (
    <VStack maxH="100vh" overflow="auto">
      <Box alignSelf="stretch" bg="gray.50">
        <Container maxW="container.md" py="8">
          <VStack alignItems="start">
            <Text fontWeight="bold" color="gray.500" fontSize="lg">
              Chapter {chapter.number.toString().padStart(2, '0')}
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {chapter.title || '無題のチャプター'}
            </Text>
          </VStack>
        </Container>
      </Box>
      <Container maxW="container.md" py="8">
        <Box
          className="markdown-body"
          padding="8px 16px"
          dangerouslySetInnerHTML={{ __html: markedContent }}
        />
      </Container>
    </VStack>
  )
}

type BookViewerProps = {
  book: Book
  chapters: Chapter[]
}

const BookViewer: VFC<BookViewerProps> = ({ book, chapters }) => {
  const rootPathTemplate = '/admin/books/:bookId/viewer'
  const rootPath = routeMap[rootPathTemplate].path({ bookId: book.id })
  const chapterPathTemplate = '/admin/books/:bookId/viewer/:chapterId'
  const chapterPath = (chapterId: string) => `${rootPath}/${chapterId}`

  const history = useHistory()
  const lastPathname = last(history.location.pathname.split('/'))
  const currentChapter = chapters.find(({ id }) => id === lastPathname) || head(chapters)

  const handleClickHome = () => {
    history.push(routeMap['/admin/books'].path())
  }

  return (
    <Box display="flex">
      <VStack
        h="100vh"
        overflow="auto"
        width="80"
        borderRight="1px"
        borderRightColor="gray.200"
        boxShadow="sm"
        py="2"
        px="4"
        spacing="8"
      >
        <Box
          alignSelf="stretch"
          borderBottom="1px"
          borderBottomColor="gray.200"
          boxShadow="sm"
          p="2"
        >
          <Text
            fontWeight="bold"
            fontSize="2xl"
            cursor="pointer"
            maxW="max-content"
            onClick={handleClickHome}
          >
            Web Book
          </Text>
        </Box>

        <HStack alignSelf="start">
          <Box
            width="100px"
            height="140px"
            bg="gray.100"
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {book.image ? (
              <Image src={book.image.url} boxShadow="md" />
            ) : (
              <Text fontWeight="bold" color="gray.500" pb="4">
                Web Book
              </Text>
            )}
          </Box>

          <Text alignSelf="start" fontWeight="bold">
            {book.title}
          </Text>
        </HStack>

        <VStack alignSelf="stretch" alignItems="start">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              as={ReactRouterLink}
              to={chapterPath(chapter.id)}
              fontWeight="bold"
            >
              <HStack color={chapter.id === currentChapter?.id ? 'blue.500' : 'gray.500'}>
                <Text fontFamily="mono">{chapter.number.toString().padStart(2, '0')}.</Text>
                <Text pb="0.5">{chapter.title || '無題のチャプター'}</Text>
              </HStack>
            </Link>
          ))}
        </VStack>
      </VStack>

      <Switch>
        <Route path={rootPathTemplate}>
          {currentChapter && (
            <Box flex="1">
              <Viewer chapter={currentChapter} />
            </Box>
          )}
        </Route>

        <Route path={chapterPathTemplate} exact>
          {currentChapter && (
            <Box flex="1">
              <Viewer chapter={currentChapter} />
            </Box>
          )}
        </Route>
      </Switch>
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
