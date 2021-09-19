import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { orderBy } from 'firebase/firestore'
import { every } from 'lodash-es'
import { head } from 'lodash-es'
import { ChangeEventHandler, Dispatch, SetStateAction, useState, VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book, BookData } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { assertIsDefined } from '@/lib/assert'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { StorageService } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'
import { ImageUpload } from '@/ui/basics/ImageUpload'

type HeaderProps = {
  onSaveBook: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ onSaveBook }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack>
            <Link as={ReactRouterLink} to={routeMap['/'].path()}>
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
          </HStack>

          <Button colorScheme="blue" onClick={onSaveBook}>
            保存する
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}

type UseStateReturn<T> = [T, Dispatch<SetStateAction<T>>]

type BookFormProps = {
  titleState: UseStateReturn<string>
  descriptionState: UseStateReturn<string>
  image: Book['image']
  onUploadBookCover: (file: File) => Promise<void>
  onDeleteBookCover: () => Promise<void>
}

const BookForm: VFC<BookFormProps> = ({
  titleState: [title, setTitle],
  descriptionState: [description, setDescription],
  image,
  onUploadBookCover,
  onDeleteBookCover,
}) => {
  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = head(e.target.files)
    if (!file) return
    await onUploadBookCover(file)
  }

  return (
    <HStack spacing="8">
      <VStack alignSelf="start">
        <Box
          width="210px"
          height="300px"
          bg="gray.100"
          borderRadius="md"
          boxShadow="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {image ? (
            <Image src={image.url} />
          ) : (
            <Text fontWeight="bold" fontSize="2xl" color="gray.500" pb="8">
              Web Book
            </Text>
          )}
        </Box>

        <HStack alignItems="center" spacing="0">
          <Button variant="link" fontSize="sm">
            <ImageUpload onUploadImage={handleUploadImage}>
              <Text>画像を設定</Text>
            </ImageUpload>
          </Button>

          {image && (
            <>
              <Text fontWeight="bold" fontSize="sm" color="gray.500" pl="1.5" pb="1">
                /
              </Text>
              <Button variant="link" fontSize="sm" px="0" onClick={onDeleteBookCover}>
                削除
              </Button>
            </>
          )}
        </HStack>
      </VStack>

      <VStack flex="1" alignSelf="stretch">
        <Input
          placeholder="本のタイトル"
          size="lg"
          fontWeight="bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Box flex="1" alignSelf="stretch">
          <AutoResizeTextarea
            placeholder="内容紹介"
            minH="100%"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </VStack>
    </HStack>
  )
}

type BookEditPageProps = {
  bookId: string
  book: Book
  chapters: Chapter[]
  saveBook: ({ title, description }: Pick<BookData, 'title' | 'description'>) => Promise<void>
  uploadBookCover: (file: File) => Promise<void>
  deleteBookCover: () => Promise<void>
  addChapter: () => Promise<void>
}

const BookEditPage: VFC<BookEditPageProps> = ({
  bookId,
  book,
  chapters,
  saveBook,
  uploadBookCover,
  deleteBookCover,
  addChapter,
}) => {
  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)

  const handleSave = async () => {
    await saveBook({ title, description })
  }

  return (
    <VStack minHeight="100vh">
      <Box alignSelf="stretch">
        <Header onSaveBook={handleSave} />
      </Box>

      <Container maxW="container.md" py="8">
        <BookForm
          {...{
            titleState: [title, setTitle],
            descriptionState: [description, setDescription],
            image: book.image,
            onUploadBookCover: uploadBookCover,
            onDeleteBookCover: deleteBookCover,
          }}
        />
      </Container>

      <Box flex="1" bg="gray.50" alignSelf="stretch">
        <Container maxW="container.md" py="8">
          <VStack spacing="8">
            <Text alignSelf="start" fontWeight="bold" fontSize="2xl">
              Chapters
            </Text>

            {chapters?.length && (
              <VStack alignSelf="stretch" alignItems="stretch" spacing="0.5">
                {chapters.map((chapter) => (
                  <HStack key={chapter.id} bg="white" py="4" px="8" spacing="8">
                    <Text fontWeight="bold" fontSize="lg" fontFamily="mono" color="blue.300">
                      {chapter.number.toString().padStart(2, '0')}
                    </Text>
                    <Link
                      as={ReactRouterLink}
                      to={routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({
                        bookId,
                        chapterId: chapter.id,
                      })}
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      {chapter.title || '無題のチャプター'}
                    </Link>
                  </HStack>
                ))}
              </VStack>
            )}

            <Button
              alignSelf="stretch"
              size="lg"
              variant="outline"
              color="gray.500"
              _hover={{ background: 'white' }}
              _active={{ background: 'white' }}
              leftIcon={<AddIcon />}
              onClick={addChapter}
            >
              チャプターを追加
            </Button>
          </VStack>
        </Container>
      </Box>
    </VStack>
  )
}

const BookEditPageContainer: VFC = () => {
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

  const saveBook = async ({ title, description }: Pick<BookData, 'title' | 'description'>) => {
    await BookService.updateDoc({ title, description }, bookId)
    await fetchBook()
  }

  const uploadBookCover = async (file: File) => {
    const path = `books-${bookId}`
    await StorageService.uploadImage({ path, blob: file })
    const url = await StorageService.getImageUrl({ path })
    await BookService.updateDoc({ image: { path, url } }, bookId)
    await fetchBook()
  }

  const deleteBookCover = async () => {
    if (!window.confirm('削除します。よろしいですか？')) return
    assertIsDefined(book?.image)
    await StorageService.deleteImage({ path: book.image.path })
    await BookService.updateDoc({ image: null }, bookId)
    await fetchBook()
  }

  const addChapter = async () => {
    assertIsDefined(chapters)
    await ChapterService.createDoc({ number: chapters.length + 1 }, { bookId })
    await fetchChapters()
  }

  return (
    <>
      {every([book, chapters], Boolean) && (
        <BookEditPage
          bookId={bookId}
          book={book!}
          chapters={chapters!}
          saveBook={saveBook}
          uploadBookCover={uploadBookCover}
          deleteBookCover={deleteBookCover}
          addChapter={addChapter}
        />
      )}
    </>
  )
}

export default BookEditPageContainer
