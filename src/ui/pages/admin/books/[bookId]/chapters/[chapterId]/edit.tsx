import 'github-markdown-css'

import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Input,
  Switch,
  Text,
  Textarea,
  TextareaProps,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { ChangeEventHandler, ForwardedRef, forwardRef, useState, VFC } from 'react'
import { FaArrowLeft, FaRegImage } from 'react-icons/fa'
import ResizeTextarea from 'react-textarea-autosize'

import { useMarked } from '@/hooks/useMarked'

type HeaderProps = {
  title: string
  onClickSave: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ title, onClickSave }) => {
  return (
    <Box h="14" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack>
            <Button variant="link" p="1">
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Button>
            <Text fontWeight="bold">{title}</Text>
          </HStack>

          <Button size="sm" colorScheme="blue" onClick={onClickSave}>
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

// https://github.com/chakra-ui/chakra-ui/issues/670#issuecomment-669916624
const AutoResizeTextarea = forwardRef(
  (props: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <Textarea
        bg="white"
        overflow="hidden"
        resize="none"
        ref={ref}
        minRows={1}
        as={ResizeTextarea}
        {...props}
      />
    )
  }
)

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
      minH="440px"
      width="720px"
      value={value}
      onChange={onChange}
    />
  )
}

const ChapterEditPage: VFC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { isOpen: isPreviewing, onOpen: preview, onClose: edit } = useDisclosure()

  return (
    <VStack spacing="8" minHeight="100vh" bg="gray.50">
      <Box alignSelf="stretch">
        <Header title={'タイトル'} onClickSave={() => Promise.resolve()} />
      </Box>

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
                  <Button size="sm">
                    <Icon as={FaRegImage} h="6" w="6" color="gray.500"></Icon>
                  </Button>
                </Center>
              </Box>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  )
}

export default ChapterEditPage
