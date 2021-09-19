import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { orderBy } from 'firebase/firestore'
import { every } from 'lodash-es'
import { head } from 'lodash-es'
import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useState,
  VFC,
} from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaBars } from 'react-icons/fa'
import { Link as ReactRouterLink, Prompt, useHistory, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book, BookData } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { assertIsDefined } from '@/lib/assert'
import { fromDate } from '@/lib/date'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { StorageService } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'
import { ImageUpload } from '@/ui/basics/ImageUpload'

type BookDetail = Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>

type BookDetailFormModalProps = {
  book: BookDetail
  isOpen: boolean
  onClose: () => void
  onSaveBookDetail: (book: BookDetail) => Promise<void>
}

const BookDetailFormModal: VFC<BookDetailFormModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveBookDetail,
}) => {
  const getDefaultValues = () => ({
    published: book.published,
    authorNames: book.authorNames.join(','),
    releasedAt: book.releasedAt?.toDate(),
    price: book.price,
  })

  const {
    register,
    handleSubmit: hookFormSubmit,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(),
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    hookFormSubmit(async ({ published, authorNames, releasedAt, price }) => {
      await onSaveBookDetail({
        published,
        authorNames: authorNames.split(',').filter(Boolean),
        releasedAt: releasedAt ? fromDate(new Date(releasedAt)) : null,
        price: Number(price),
      })
      reset(getDefaultValues())
      onClose()
    })(e)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>本の設定</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing="4">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.500">
                  非公開 / 公開
                </FormLabel>
                <Switch size="lg" {...register('published')} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.500">
                  著者名
                </FormLabel>
                <Input autoComplete="off" {...register('authorNames')} placeholder="著者A, 著者B" />
                <FormHelperText>複数人の場合はカンマ区切りで入力してください。</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.500">
                  発売日
                </FormLabel>
                <Input type="date" {...register('releasedAt')} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.500">
                  価格（円）
                </FormLabel>
                <Input type="number" autoComplete="off" {...register('price')} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="sm" colorScheme="blue">
              保存
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

type HeaderProps = {
  book: Book
  onSaveBook: () => Promise<void>
  onSaveBookDetail: (
    bookDetail: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  ) => Promise<void>
}

const Header: VFC<HeaderProps> = ({ book, onSaveBook, onSaveBookDetail }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box h="14" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <Link as={ReactRouterLink} to={routeMap['/'].path()}>
            <Icon as={FaArrowLeft} h="5" w="5" color="gray.500" />
          </Link>

          <HStack spacing="4">
            <Tooltip label="本の設定">
              <Button size="sm" onClick={onOpen}>
                <Icon as={FaBars} h="5" w="5" color="gray.500" />
              </Button>
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
          width="200px"
          height="280px"
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
  saveBookDetail: (
    bookDetail: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  ) => Promise<void>
  uploadBookCover: (file: File) => Promise<void>
  deleteBookCover: () => Promise<void>
  addChapter: () => Promise<void>
}

const BookEditPage: VFC<BookEditPageProps> = ({
  bookId,
  book,
  chapters,
  saveBook,
  saveBookDetail,
  uploadBookCover,
  deleteBookCover,
  addChapter,
}) => {
  const history = useHistory()

  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)

  const handleSaveBook = async () => {
    await saveBook({ title, description })
  }

  const changed = book.title !== title || book.description !== description

  const handleClickChapter = async (chapterId: string) => {
    if (changed) await saveBook({ title, description })
    history.push(
      routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({ bookId, chapterId })
    )
  }

  return (
    <>
      <Prompt when={changed} message="保存せずに終了しますか？" />

      <VStack minHeight="100vh">
        <Box alignSelf="stretch">
          <Header book={book} onSaveBook={handleSaveBook} onSaveBookDetail={saveBookDetail} />
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
                      <Button
                        onClick={() => handleClickChapter(chapter.id)}
                        variant="link"
                        color="black"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        {chapter.title || '無題のチャプター'}
                      </Button>
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
    </>
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

  const saveBookDetail = async ({
    published,
    authorNames,
    releasedAt,
    price,
  }: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>) => {
    await BookService.updateDoc({ published, authorNames, releasedAt, price }, bookId)
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
          saveBookDetail={saveBookDetail}
          uploadBookCover={uploadBookCover}
          deleteBookCover={deleteBookCover}
          addChapter={addChapter}
        />
      )}
    </>
  )
}

export default BookEditPageContainer
