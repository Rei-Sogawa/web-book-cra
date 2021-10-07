import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { Link as ReactRouterLink, useHistory } from 'react-router-dom'

import { numberToTwoDigits } from '@/lib/display'
import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'
import { routeMap } from '@/routes'
import { BookImage } from '@/ui/Shared/BookImage'

export type SidebarProps = {
  book: Book
  chapters: Chapter[]
  currentChapterId?: string
}

export const Sidebar: VFC<SidebarProps> = ({ book, chapters, currentChapterId }) => {
  // app
  const history = useHistory()
  const bookViewerPath = routeMap['/books/:bookId/viewer'].path({ bookId: book.id })
  const viewerShowPath = (chapterId: string) => `${bookViewerPath}/${chapterId}`

  // handler
  const handleClickHome = () => {
    history.push(routeMap['/my-page'].path())
  }

  const handleClickBook = () => {
    history.push(routeMap['/books/:bookId/viewer'].path({ bookId: book.id }))
  }

  return (
    <VStack
      h="100vh"
      overflow="auto"
      width="96"
      borderRight="1px"
      borderRightColor="gray.200"
      boxShadow="sm"
      py="2"
      px="6"
      spacing="8"
      bg="white"
    >
      <Box alignSelf="stretch" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm" p="2">
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
        <BookImage
          imageUrl={book.image?.url}
          size="sm"
          flexShrink={0}
          cursor="pointer"
          onClick={handleClickBook}
        />

        <Text alignSelf="start" fontWeight="bold" cursor="pointer" onClick={handleClickBook}>
          {book.title}
        </Text>
      </HStack>

      <VStack alignSelf="stretch" alignItems="start">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            as={ReactRouterLink}
            to={viewerShowPath(chapter.id)}
            fontWeight="bold"
          >
            <HStack color={chapter.id === currentChapterId ? 'blue.500' : 'gray.500'}>
              <Text fontFamily="mono">{numberToTwoDigits(chapter.number)}.</Text>
              <Text pb="0.5">{chapter.title || '無題のチャプター'}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
    </VStack>
  )
}
