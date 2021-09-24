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

import { Book } from '@/model/book'
import { routeMap } from '@/routes'
import {
  BookDetailFormModal,
  BookDetailFormModalProps,
} from '@/ui/AdminBookEditPage/BookDetailFormModal'

export type HeaderProps = {
  book: Book
  onSaveBook: () => Promise<void>
  onSaveBookDetail: BookDetailFormModalProps['onSaveBookDetail']
  changed: boolean
}

export const Header: VFC<HeaderProps> = ({ book, onSaveBook, onSaveBookDetail, changed }) => {
  // ui
  const {
    isOpen: isBookDetailFormModalOpen,
    onOpen: openBookDetailFormModal,
    onClose: closeBookDetailFormModal,
  } = useDisclosure()

  return (
    <Box h="14" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm" bg="white">
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
                onClick={openBookDetailFormModal}
              />
            </Tooltip>
            <Button size="sm" colorScheme="blue" onClick={onSaveBook} disabled={!changed}>
              保存する
            </Button>
          </HStack>
        </HStack>
      </Container>

      <BookDetailFormModal
        book={book}
        isOpen={isBookDetailFormModalOpen}
        onClose={closeBookDetailFormModal}
        onSaveBookDetail={onSaveBookDetail}
      />
    </Box>
  )
}
