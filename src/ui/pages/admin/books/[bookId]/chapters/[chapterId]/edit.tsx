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
import { getUnixTime } from 'date-fns'
import { head } from 'lodash-es'
import { ChangeEventHandler, useRef, useState, VFC } from 'react'
import { FaArrowLeft, FaRegImage } from 'react-icons/fa'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { useAsync } from 'react-use'

import { Book } from '@/domain/book'
import { useMarked } from '@/hooks/useMarked'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { deleteImage, getImageUrl, uploadImage } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'

type HeaderProps = {
  book: Book
  onClickSave: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ book, onClickSave }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack>
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
            >
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
            <Text fontWeight="bold" fontSize="2xl">
              {book.title}
            </Text>
          </HStack>

          <Button colorScheme="blue" onClick={onClickSave}>
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

  const inputImageRef = useRef<HTMLInputElement>(null)
  const handleClickUploadImage = () => {
    inputImageRef.current?.click()
  }

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
                <input
                  type="file"
                  accept="image/*"
                  ref={inputImageRef}
                  style={{ display: 'none' }}
                  onChange={handleUploadImage}
                />
                <Button size="sm" onClick={handleClickUploadImage}>
                  <Icon as={FaRegImage} h="6" w="6" color="gray.500" />
                </Button>
              </Center>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  )
}

const ChapterEditPage: VFC = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const { value: book } = useAsync(async () => {
    const res = await BookService.getDoc(bookId)
    return res
  }, [bookId])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = head(e.target.files)
    if (file) {
      const path = `books-1-chapters-1-images-${getUnixTime(new Date())}`
      await uploadImage({
        path,
        blob: file,
      })
      const imageUrl = await getImageUrl({ path })
    }
  }

  return (
    <VStack spacing="8" minHeight="100vh" bg="gray.50">
      {book && (
        <>
          <Box alignSelf="stretch">
            <Header book={book} onClickSave={() => Promise.resolve()} />
          </Box>

          <ChapterEditor {...{ title, setTitle, content, setContent, handleUploadImage }} />
        </>
      )}
    </VStack>
  )
}

export default ChapterEditPage
