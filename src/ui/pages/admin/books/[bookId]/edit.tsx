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
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState, VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book, BookData } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { StorageService } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'
import { ImageUpload } from '@/ui/basics/ImageUpload'

type HeaderProps = {
  onClickSave: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ onClickSave }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack>
            <Link as={ReactRouterLink} to={routeMap['/'].path()}>
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
          </HStack>

          <Button colorScheme="blue" onClick={onClickSave}>
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
  imageUrl: string | null
  onUploadImage: ChangeEventHandler<HTMLInputElement>
}

const BookForm: VFC<BookFormProps> = ({
  titleState: [title, setTitle],
  descriptionState: [contentIntroduction, setContentIntroduction],
  imageUrl,
  onUploadImage,
}) => {
  return (
    <HStack spacing="8">
      <ImageUpload onUploadImage={onUploadImage}>
        <VStack spacing="3">
          <Box
            cursor="pointer"
            width="210px"
            height="300px"
            bg="gray.100"
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {imageUrl ? (
              <Image src={imageUrl} />
            ) : (
              <Text fontWeight="bold" fontSize="2xl" color="gray.500" pb="8">
                Web Book
              </Text>
            )}
          </Box>
          <Button variant="link" fontWeight="normal" fontSize="sm">
            カバー画像を変更
          </Button>
        </VStack>
      </ImageUpload>

      <VStack flex="1" alignSelf="stretch">
        <Input
          placeholder="本のタイトル"
          size="lg"
          fontWeight="bold"
          fontSize="2xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Box flex="1" alignSelf="stretch">
          <AutoResizeTextarea
            placeholder="内容紹介"
            minH="100%"
            value={contentIntroduction}
            onChange={(e) => setContentIntroduction(e.target.value)}
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
  saveBook: (bookData: Partial<BookData>) => Promise<void>
  updateBookCover: (file: File) => Promise<void>
  addChapter: () => Promise<void>
}

const BookEditPage: VFC<BookEditPageProps> = ({
  bookId,
  book,
  chapters,
  saveBook,
  updateBookCover,
  addChapter,
}) => {
  const handleClickAddChapter = async () => {
    await addChapter()
  }

  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)

  const handleClickSave = async () => {
    await saveBook({ title, description })
  }

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = head(e.target.files)
    if (file) {
      updateBookCover(file)
    }
  }

  return (
    <VStack minHeight="100vh">
      {book && (
        <>
          <Box alignSelf="stretch">
            <Header onClickSave={handleClickSave} />
          </Box>

          <Container maxW="container.md" py="8">
            <BookForm
              {...{
                titleState: [title, setTitle],
                descriptionState: [description, setDescription],
                imageUrl: book.imageUrl,
                onUploadImage: handleUploadImage,
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
                  onClick={handleClickAddChapter}
                >
                  チャプターを追加
                </Button>
              </VStack>
            </Container>
          </Box>
        </>
      )}
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

  const saveBook = async (bookData: Partial<BookData>) => {
    await BookService.updateDoc(bookData, bookId)
    await fetchBook()
  }

  const updateBookCover = async (file: File) => {
    const path = `books-${bookId}`
    await StorageService.uploadImage({ path, blob: file })
    const imageUrl = await StorageService.getImageUrl({ path })
    await BookService.updateDoc({ imageUrl }, bookId)
    await fetchBook()
  }

  const addChapter = async () => {
    await ChapterService.createDoc({ number: chapters!.length + 1 }, { bookId })
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
          updateBookCover={updateBookCover}
          addChapter={addChapter}
        />
      )}
    </>
  )
}

export default BookEditPageContainer
