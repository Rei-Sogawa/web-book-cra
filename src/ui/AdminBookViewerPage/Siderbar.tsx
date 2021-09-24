import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { Link as ReactRouterLink, useHistory } from 'react-router-dom'

import { numberToTwoDigits } from '@/lib/display'
import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'
import { routeMap } from '@/routes'

import { BookImage } from '../Shared/BookImage'

export type SidebarProps = {
  book: Book
  chapters: Chapter[]
  currentChapterId?: string
}

export const Sidebar: VFC<SidebarProps> = ({ book, chapters, currentChapterId }) => {
  // app
  const history = useHistory()
  const adminBookViewerPath = routeMap['/admin/books/:bookId/viewer'].path({ bookId: book.id })
  const viewerShowPath = (chapterId: string) => `${adminBookViewerPath}/${chapterId}`

  // handler
  const handleClickHome = () => {
    history.push(routeMap['/admin/books'].path())
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
      bg="gray.50"
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
        <BookImage imageUrl={book.image?.url} size="sm" />

        <Text alignSelf="start" fontWeight="bold">
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
