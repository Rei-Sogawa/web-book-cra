import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { orderBy } from 'firebase/firestore'
import { every } from 'lodash-es'
import React, { VFC } from 'react'
import { BiRightArrow } from 'react-icons/bi'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { Link as ReactRouterLink, useHistory } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book } from '@/domain'
import { routeMap } from '@/routes'
import { BookService, ChapterService } from '@/service/firestore'
import { StorageService } from '@/service/storage'

const Header: VFC = () => {
  const history = useHistory()

  const handleClickAddBook = () => {
    history.push(routeMap['/admin/books/new'].path())
  }

  return (
    <Box h="14" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack justifyContent="space-between" h="100%">
          <Text fontWeight="bold" fontSize="2xl">
            Web Book
          </Text>

          <HStack spacing="6">
            <Button size="sm" colorScheme="blue" onClick={handleClickAddBook}>
              本を作る
            </Button>
            <Avatar size="sm" />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

type BookItemProps = {
  book: Book
  onDeleteBook: (book: Book) => Promise<void>
}

const BookItem: VFC<BookItemProps> = ({ book, onDeleteBook }) => {
  const history = useHistory()

  const handleClickShow = () => {
    history.push(routeMap['/admin/books/:bookId/viewer'].path({ bookId: book.id }))
  }

  const handleClickEdit = () => {
    history.push(routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id }))
  }

  const handleClickDelete = async () => {
    await onDeleteBook(book)
  }

  return (
    <Box>
      <HStack justifyContent="space-between">
        <HStack spacing="4">
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

          <VStack alignSelf="start" alignItems="start" spacing="1">
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
              fontWeight="bold"
            >
              {book.title}
            </Link>
            {book.published ? (
              <Tag size="sm" colorScheme="blue" fontWeight="bold" fontSize="xs" color="blue.900">
                公開中
              </Tag>
            ) : (
              <Tag size="sm" fontWeight="bold" fontSize="xs" color="gray.500">
                未公開
              </Tag>
            )}
            <Box pl="2">
              <Text fontSize="xs" color="gray.500">
                著者: {book.authorNames.join(', ')}
              </Text>
              <Text fontSize="xs" color="gray.500">
                発売日: {book.releasedAt ? format(book.releasedAt.toDate(), 'yyyy-MM-dd') : ''}
              </Text>
              <Text fontSize="xs" color="gray.500">
                価格: {book.price} 円
              </Text>
            </Box>
          </VStack>
        </HStack>

        <HStack alignSelf="start">
          <IconButton
            aria-label="edit book"
            size="sm"
            isRound
            icon={<Icon as={BiRightArrow} h="4" w="4" color="gray.500" />}
            onClick={handleClickShow}
          />
          <IconButton
            aria-label="edit book"
            size="sm"
            isRound
            icon={<Icon as={HiOutlinePencil} h="4" w="4" color="gray.500" />}
            onClick={handleClickEdit}
          />
          <IconButton
            aria-label="delete book"
            size="sm"
            isRound
            icon={<Icon as={HiOutlineTrash} h="4" w="4" color="gray.500" />}
            onClick={handleClickDelete}
          />
        </HStack>
      </HStack>
    </Box>
  )
}

type BooksPageProps = {
  books: Book[]
  deleteBook: (book: Book) => Promise<void>
}

const BooksPage: VFC<BooksPageProps> = ({ books, deleteBook }) => {
  return (
    <VStack spacing="8">
      <Box alignSelf="stretch">
        <Header />
      </Box>

      <Container maxW="container.md" pb="8">
        <VStack spacing="4" alignItems="stretch">
          <Text fontWeight="bold" fontSize="2xl">
            Books
          </Text>

          <VStack alignItems="stretch" spacing="4">
            {books.map((book) => (
              <VStack alignItems="stretch" spacing="4">
                <BookItem key={book.id} book={book} onDeleteBook={deleteBook} />
                <Box borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm" />
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </VStack>
  )
}

const BooksPageContainer: VFC = () => {
  const [{ value: books }, fetchBooks] = useAsyncFn(() => {
    return BookService.getDocs(undefined, orderBy('updatedAt', 'desc'))
  })

  useMount(() => {
    fetchBooks()
  })

  const deleteBook = async (book: Book) => {
    if (!window.confirm('削除します。よろしいですか？')) return
    await BookService.deleteDoc(book.id)
    if (book.image) await StorageService.deleteImage(book.image.path)
    const chapters = await ChapterService.getDocs({ bookId: book.id })
    await Promise.all(
      chapters.map((chapter) => ChapterService.deleteDoc(chapter.id, { bookId: book.id }))
    )
    const chapterImagePaths = chapters
      .map((chapter) => chapter.images)
      .map((images) => images.map((image) => image.path))
      .flat()
    await Promise.all(
      chapterImagePaths.map((chapterImagePath) => StorageService.deleteImage(chapterImagePath))
    )
    await fetchBooks()
  }

  return <>{every([books], Boolean) && <BooksPage books={books!} deleteBook={deleteBook} />}</>
}

export default BooksPageContainer
