import { Box, Container, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { useState, VFC } from 'react'
import { Prompt, useHistory } from 'react-router-dom'

import { Book, Chapter } from '@/domain'
import { routeMap } from '@/routes'
import { BookBasicForm, BookBasicFormProps } from '@/ui/AdminBookEditPage/BookBasicForm'
import { Chapters, ChaptersProps } from '@/ui/AdminBookEditPage/Chapters'
import { Header, HeaderProps } from '@/ui/AdminBookEditPage/Header'
import {
  useAdminBookEditPageCommand,
  useAdminBookEditPageQuery,
} from '@/ui/AdminBookEditPage/useAdminBookEditPage'

type BookEditPageProps = {
  book: Book
  chapters: Chapter[]
}

const BookEditPage: VFC<BookEditPageProps> = ({ book, chapters }) => {
  const history = useHistory()

  const { saveBook, saveBookDetail, uploadBookCover, deleteBookCover, addChapter } =
    useAdminBookEditPageCommand()

  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)
  const changed = book.title !== title || book.description !== description

  const handleSaveBook: HeaderProps['onSaveBook'] = async () => {
    await saveBook({ title, description })
  }
  const handleDeleteBookCover: BookBasicFormProps['onDeleteBookCover'] = async () => {
    await deleteBookCover(book.image)
  }
  const handleClickChapter: ChaptersProps['onClickChapter'] = async (chapterId: string) => {
    if (changed) await saveBook({ title, description })
    history.push(
      routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({ bookId: book.id, chapterId })
    )
  }
  const handleAddChapter: ChaptersProps['onAddChapter'] = async () => {
    await addChapter(chapters.length)
  }

  return (
    <>
      <Prompt when={changed} message="保存せずに終了しますか？" />

      <VStack minHeight="100vh">
        <Box alignSelf="stretch">
          <Header book={book} onSaveBook={handleSaveBook} onSaveBookDetail={saveBookDetail} />
        </Box>

        <Container maxW="container.md" py="8">
          <BookBasicForm
            {...{
              titleState: [title, setTitle],
              descriptionState: [description, setDescription],
              image: book.image,
              onUploadBookCover: uploadBookCover,
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
  const { book, chapters } = useAdminBookEditPageQuery()

  return (
    <>{every([book, chapters], Boolean) && <BookEditPage book={book!} chapters={chapters!} />}</>
  )
}

export default Wrapper
