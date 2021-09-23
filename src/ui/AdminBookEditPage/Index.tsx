import { Box, Container, VStack } from '@chakra-ui/react'
import { every } from 'lodash-es'
import { useState, VFC } from 'react'
import { Prompt, useHistory } from 'react-router-dom'

import { Book, Chapter } from '@/domain'
import { useAppToast } from '@/hooks/useAppToast'
import { routeMap } from '@/routes'

import { BookBasicForm } from './BookBasicForm'
import { Chapters, ChaptersProps } from './Chapters'
import { useAdminBookEditPageMutation, useAdminBookEditPageQuery } from './container'
import { Header, HeaderProps } from './Header'

type BookEditPageProps = {
  book: Book
  chapters: Chapter[]
}

const BookEditPage: VFC<BookEditPageProps> = ({ book, chapters }) => {
  // app
  const history = useHistory()
  const toast = useAppToast()

  // container
  const { saveBook, saveBookDetail, uploadBookCover, deleteBookCover, addChapter } =
    useAdminBookEditPageMutation({ book, chapters })

  // ui
  const [title, setTitle] = useState(book.title)
  const [description, setDescription] = useState(book.description)

  const changed = book.title !== title || book.description !== description

  // handler
  const handleSaveBook: HeaderProps['onSaveBook'] = async () => {
    if (!title.trim()) {
      toast.error('本のタイトルを入力してください。')
      return
    }
    await saveBook({ title, description })
  }

  const handleClickChapter: ChaptersProps['onClickChapter'] = async (chapterId: string) => {
    if (!title.trim()) {
      toast.error('本のタイトルを入力してください。')
      return
    }
    if (changed) await saveBook({ title, description })
    history.push(
      routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({ bookId: book.id, chapterId })
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
          <BookBasicForm
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
            <Chapters
              chapters={chapters}
              onAddChapter={addChapter}
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
