import 'github-markdown-css'

import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { head } from 'lodash-es'
import { every } from 'lodash-es'
import { ChangeEventHandler, useEffect, useState, VFC } from 'react'
import { FaArrowLeft, FaRegImage } from 'react-icons/fa'
import { Link as ReactRouterLink, Prompt, useParams } from 'react-router-dom'
import { useAsyncFn, useMount } from 'react-use'

import { Book } from '@/domain/book'
import { Chapter, ChapterData } from '@/domain/chapter'
import { useMarked } from '@/hooks/useMarked'
import { assertIsDefined } from '@/lib/assert'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { StorageService } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'
import { ImageUpload } from '@/ui/basics/ImageUpload'

type HeaderProps = {
  book: Book
  onSaveChapter: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ book, onSaveChapter }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack spacing="4">
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
            >
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
            <Text fontWeight="bold" fontSize="lg">
              {book.title}
            </Text>
          </HStack>

          <Button colorScheme="blue" onClick={onSaveChapter}>
            保存する
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}

type MarkedContentProps = {
  content: string
}

const MarkedContent: VFC<MarkedContentProps> = ({ content }) => {
  const markedContent = useMarked(content)

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxSizing="border-box"
      minHeight="440px"
      width="720px"
      boxShadow="md"
    >
      <Box
        className="markdown-body"
        padding="8px 16px"
        dangerouslySetInnerHTML={{ __html: markedContent }}
      />
    </Box>
  )
}

type MarkedContentEditorProps = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

const MarkedContentEditor: VFC<MarkedContentEditorProps> = ({ value, onChange }) => {
  return (
    <AutoResizeTextarea
      placeholder="Write in Markdown"
      _placeholder={{
        fontWeight: 'bold',
      }}
      bg="white"
      minH="440px"
      width="720px"
      value={value}
      onChange={onChange}
    />
  )
}

type ChapterEditorProps = {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  handleUploadImage: ChangeEventHandler<HTMLInputElement>
}

const ChapterEditor: VFC<ChapterEditorProps> = ({
  title,
  setTitle,
  content,
  setContent,
  handleUploadImage,
}) => {
  const { isOpen: isPreviewing, onOpen: preview, onClose: edit } = useDisclosure()

  return (
    <HStack pb="8">
      <VStack spacing="8">
        {isPreviewing ? (
          <Text
            alignSelf="start"
            bg="white"
            fontSize="lg"
            fontWeight="bold"
            h="48px"
            w="720px"
            py="2"
            px="4"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            display="flex"
            alignItems="center"
            boxShadow="md"
          >
            {title}
          </Text>
        ) : (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            size="lg"
            alignSelf="start"
            bg="white"
            width="720px"
            fontWeight="bold"
          />
        )}

        <HStack spacing="8">
          {isPreviewing ? (
            <MarkedContent content={content} />
          ) : (
            <MarkedContentEditor value={content} onChange={(e) => setContent(e.target.value)} />
          )}

          <VStack alignSelf="start" spacing="4">
            <Box>
              <Text textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
                Edit / Preview
              </Text>
              <Center mt="1">
                <Switch
                  size="lg"
                  isChecked={isPreviewing}
                  onChange={(e) => (e.target.checked ? preview() : edit())}
                />
              </Center>
            </Box>

            <Box>
              <Text textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
                Upload Image
              </Text>
              <Center mt="1">
                <ImageUpload onUploadImage={handleUploadImage}>
                  <Button size="sm">
                    <Icon as={FaRegImage} h="6" w="6" color="gray.500" />
                  </Button>
                </ImageUpload>
              </Center>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  )
}

type ChapterEditPageProps = {
  book: Book
  chapter: Chapter
  saveChapter: ({ title, content }: Pick<Chapter, 'title' | 'content'>) => Promise<void>
  uploadImage: (file: File) => Promise<string>
}

const ChapterEditPage: VFC<ChapterEditPageProps> = ({
  book,
  chapter,
  saveChapter,
  uploadImage,
}) => {
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content)

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

  const changed = chapter.title !== title || chapter.content !== content

  useEffect(() => {
    console.log(changed)
  }, [changed])

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
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const [{ value: book }, fetchBook] = useAsyncFn(() => {
    return BookService.getDoc(bookId)
  })

  const [{ value: chapter }, fetchChapter] = useAsyncFn(() => {
    return ChapterService.getDoc(chapterId, { bookId })
  })

  useMount(() => {
    fetchBook()
    fetchChapter()
  })

  const saveChapter = async ({ title, content }: Pick<ChapterData, 'title' | 'content'>) => {
    assertIsDefined(chapter)
    const deletedFiles = chapter.images.filter((image) => !content.includes(image.url))
    await ChapterService.updateDoc(
      {
        title,
        content,
        images: chapter.images.filter(
          (image) => !deletedFiles.find((deletedImage) => deletedImage.path === image.path)
        ),
      },
      chapterId,
      { bookId }
    )
    await Promise.all(deletedFiles.map((image) => StorageService.deleteImage({ path: image.path })))
  }

  const uploadImage = async (file: File) => {
    assertIsDefined(chapter)
    const path = `books-${bookId}-chapters-${chapterId}-${new Date().getTime()}`
    await StorageService.uploadImage({ path, blob: file })
    const url = await StorageService.getImageUrl({ path })
    await ChapterService.updateDoc({ images: [...chapter.images, { path, url }] }, chapterId, {
      bookId,
    })
    await fetchChapter()
    return url
  }

  return (
    <>
      {every([book, chapter], Boolean) && (
        <ChapterEditPage
          book={book!}
          chapter={chapter!}
          uploadImage={uploadImage}
          saveChapter={saveChapter}
        />
      )}
    </>
  )
}

export default ChapterEditPageContainer
