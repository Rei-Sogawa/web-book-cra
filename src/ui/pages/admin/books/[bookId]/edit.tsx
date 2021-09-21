import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Container, HStack, Text, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { useState, VFC } from 'react'
import { Prompt, useHistory, useParams } from 'react-router-dom'

import { useBookEditPageCommand, useBookEditPageQuery } from '@/application/adminBookEditPage'
import { Book, Chapter } from '@/domain'
import { routeMap } from '@/routes'
import { BookForm, BookFormProps } from '@/ui/components/AdminBookEditPage/BookForm'
import { Header, HeaderProps } from '@/ui/components/AdminBookEditPage/Header'

type BookEditPageProps = {
  bookId: string
  book: Book
  chapters: Chapter[]
}

const BookEditPage: VFC<BookEditPageProps> = ({ bookId, book, chapters }) => {
  const { saveBook, saveBookDetail, uploadBookCover, deleteBookCover, addChapter } =
    useBookEditPageCommand()

  const history = useHistory()
  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)

  const changed = book.title !== title || book.description !== description

  const handleSaveBook: HeaderProps['onSaveBook'] = async () => {
    await saveBook({ title, description }, bookId)
  }
  const handleSaveBookDetail: HeaderProps['onSaveBookDetail'] = async (v) => {
    await saveBookDetail(v, bookId)
  }
  const handleUploadBookCover: BookFormProps['onUploadBookCover'] = async (file) => {
    await uploadBookCover(file, bookId)
  }
  const handleDeleteBookCover: BookFormProps['onDeleteBookCover'] = async () => {
    await deleteBookCover(book)
  }
  const handleClickChapter = async (chapterId: string) => {
    if (changed) await saveBook({ title, description }, bookId)
    history.push(
      routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({ bookId, chapterId })
    )
  }
  const handleClickAddChapter = async () => {
    await addChapter(chapters.length, bookId)
  }

  return (
    <>
      <Prompt when={changed} message="保存せずに終了しますか？" />

      <VStack minHeight="100vh">
        <Box alignSelf="stretch">
          <Header book={book} onSaveBook={handleSaveBook} onSaveBookDetail={handleSaveBookDetail} />
        </Box>

        <Container maxW="container.md" py="8">
          <BookForm
            {...{
              titleState: [title, setTitle],
              descriptionState: [description, setDescription],
              image: book.image,
              onUploadBookCover: handleUploadBookCover,
              onDeleteBookCover: handleDeleteBookCover,
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
                onClick={handleClickAddChapter}
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
  const { book, chapters } = useBookEditPageQuery(bookId)

  return (
    <>
      {every([book, chapters], Boolean) && (
        <BookEditPage bookId={bookId} book={book!} chapters={chapters!} />
      )}
    </>
  )
}

export default BookEditPageContainer
