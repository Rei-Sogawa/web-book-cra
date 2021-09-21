import { Box, Container, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { useState, VFC } from 'react'
import { Prompt, useHistory, useParams } from 'react-router-dom'

import { useBookEditPageCommand, useBookEditPageQuery } from '@/application/adminBookEditPage'
import { Book, Chapter } from '@/domain'
import { routeMap } from '@/routes'
import { BookBasicForm, BookBasicFormProps } from '@/ui/AdminBookEditPage/BookBasicForm'
import { Chapters, ChaptersProps } from '@/ui/AdminBookEditPage/Chapters'
import { Header, HeaderProps } from '@/ui/AdminBookEditPage/Header'

type BookEditPageProps = {
  bookId: string
  book: Book
  chapters: Chapter[]
}

const BookEditPage: VFC<BookEditPageProps> = ({ bookId, book, chapters }) => {
  const history = useHistory()
  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)
  const changed = book.title !== title || book.description !== description

  const { saveBook, saveBookDetail, uploadBookCover, deleteBookCover, addChapter } =
    useBookEditPageCommand()

  const handleSaveBook: HeaderProps['onSaveBook'] = async () => {
    await saveBook({ title, description }, bookId)
  }
  const handleSaveBookDetail: HeaderProps['onSaveBookDetail'] = async (v) => {
    await saveBookDetail(v, bookId)
  }
  const handleUploadBookCover: BookBasicFormProps['onUploadBookCover'] = async (file) => {
    await uploadBookCover(file, bookId)
  }
  const handleDeleteBookCover: BookBasicFormProps['onDeleteBookCover'] = async () => {
    await deleteBookCover(book)
  }
  const handleClickChapter: ChaptersProps['onClickChapter'] = async (chapterId: string) => {
    if (changed) await saveBook({ title, description }, bookId)
    history.push(
      routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({ bookId, chapterId })
    )
  }
  const handleAddChapter: ChaptersProps['onAddChapter'] = async () => {
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
          <BookBasicForm
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
            <Chapters
              chapters={chapters}
              onAddChapter={handleAddChapter}
              onClickChapter={handleClickChapter}
            />
          </Container>
        </Box>
      </VStack>
    </>
  )
}

const Wrapper: VFC = () => {
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

export default Wrapper
