import { Box, VStack } from '@chakra-ui/react'
import { head } from 'lodash-es'
import { every } from 'lodash-es'
import { ChangeEventHandler, useState, VFC } from 'react'
import { Prompt } from 'react-router-dom'

import { Book } from '@/model/book'
import { Chapter } from '@/model/chapter'

import { ChapterEditor } from './ChapterEditor'
import { useAdminChapterEditPageMutation, useAdminChapterEditPageQuery } from './container'
import { Header } from './Header'

type ChapterEditPageProps = {
  book: Book
  chapter: Chapter
}

const ChapterEditPage: VFC<ChapterEditPageProps> = ({ book, chapter }) => {
  // container
  const { saveChapter, uploadImage } = useAdminChapterEditPageMutation(book, chapter)

  // ui
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content)

  const changed = chapter.title !== title || chapter.content !== content

  // handler
  const handleSaveChapter = async () => {
    await saveChapter({ title, content })
  }

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = head(e.target.files)
    if (!file) return
    const url = await uploadImage(file)
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

        <ChapterEditor
          {...{
            titleState: [title, setTitle],
            contentState: [content, setContent],
            handleUploadImage,
          }}
        />
      </VStack>
    </>
  )
}

const Wrapper: VFC = () => {
  const { book, chapter } = useAdminChapterEditPageQuery()

  return (
    <>{every([book, chapter], Boolean) && <ChapterEditPage book={book!} chapter={chapter!} />}</>
  )
}

export default Wrapper
