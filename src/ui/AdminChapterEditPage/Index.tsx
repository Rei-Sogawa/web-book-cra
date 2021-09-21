import { Box, VStack } from '@chakra-ui/react'
import { head } from 'lodash-es'
import { every } from 'lodash-es'
import { ChangeEventHandler, useState, VFC } from 'react'
import { Prompt } from 'react-router-dom'

import { Book, Chapter } from '@/domain'

import { ChapterEditor } from './ChapterEditor'
import { Header } from './Header'
import {
  useAdminChapterEditPageCommand,
  useAdminChapterEditPageQuery,
} from './useAdminChapterEditPage'

type ChapterEditPageProps = {
  book: Book
  chapter: Chapter
}

const ChapterEditPage: VFC<ChapterEditPageProps> = ({ book, chapter }) => {
  const { saveChapter, uploadImage } = useAdminChapterEditPageCommand()

  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content)
  const changed = chapter.title !== title || chapter.content !== content

  const handleSaveChapter = async () => {
    await saveChapter({ title, content }, chapter)
  }
  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = head(e.target.files)
    if (!file) return
    const url = await uploadImage(file, chapter)
    const markedUrl = `![](${url})`
    setContent((prev) => prev + markedUrl + '\n')
  }

  return (
    <>
      <Prompt when={changed} message="保存せずに終了しますか？" />

      <VStack spacing="8" minHeight="100vh" bg="gray.50">
        <Box alignSelf="stretch">
          <Header book={book} onSaveChapter={handleSaveChapter} />
        </Box>

        <ChapterEditor {...{ title, setTitle, content, setContent, handleUploadImage }} />
      </VStack>
    </>
  )
}

const ChapterEditPageContainer: VFC = () => {
  const { book, chapter } = useAdminChapterEditPageQuery()

  return (
    <>{every([book, chapter], Boolean) && <ChapterEditPage book={book!} chapter={chapter!} />}</>
  )
}

export default ChapterEditPageContainer
