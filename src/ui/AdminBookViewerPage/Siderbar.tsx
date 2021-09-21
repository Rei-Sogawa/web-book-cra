import { Box, HStack, Image, Link, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { Link as ReactRouterLink, useHistory } from 'react-router-dom'

import { Book, Chapter } from '@/domain'
import { routeMap } from '@/routes'

export type SidebarProps = {
  book: Book
  chapters: Chapter[]
  currentChapterId?: string
}

export const Sidebar: VFC<SidebarProps> = ({ book, chapters, currentChapterId }) => {
  const history = useHistory()

  const rootPath = routeMap['/admin/books/:bookId/viewer'].path({ bookId: book.id })
  const chapterPath = (chapterId: string) => `${rootPath}/${chapterId}`

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
            <Image src={book.image.url} />
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
            <HStack color={chapter.id === currentChapterId ? 'blue.500' : 'gray.500'}>
              <Text fontFamily="mono">{chapter.number.toString().padStart(2, '0')}.</Text>
              <Text pb="0.5">{chapter.title || '無題のチャプター'}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
    </VStack>
  )
}
