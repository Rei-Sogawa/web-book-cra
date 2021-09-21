import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  IconButton,
  Link,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { VFC } from 'react'
import { FaArrowLeft, FaBars } from 'react-icons/fa'
import { Link as ReactRouterLink } from 'react-router-dom'

import { Book, BookData } from '@/domain'
import { routeMap } from '@/routes'
import { BookDetailFormModal } from '@/ui/AdminBookEditPage/BookDetailFormModal'

export type HeaderProps = {
  book: Book
  onSaveBook: () => Promise<void>
  onSaveBookDetail: (
    editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  ) => Promise<void>
}

export const Header: VFC<HeaderProps> = ({ book, onSaveBook, onSaveBookDetail }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box h="14" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <Link as={ReactRouterLink} to={routeMap['/admin/books'].path()}>
            <Icon as={FaArrowLeft} h="4" w="4" color="gray.500" />
          </Link>

          <HStack spacing="4">
            <Tooltip label="本の設定">
              <IconButton
                aria-label="edit book detail"
                icon={<Icon as={FaBars} h="4" w="4" color="gray.500" />}
                size="sm"
                isRound
                onClick={onOpen}
              />
            </Tooltip>
            <Button size="sm" colorScheme="blue" onClick={onSaveBook}>
              保存する
            </Button>
          </HStack>
        </HStack>
      </Container>

      <BookDetailFormModal
        book={book}
        isOpen={isOpen}
        onClose={onClose}
        onSaveBookDetail={onSaveBookDetail}
      />
    </Box>
  )
}
