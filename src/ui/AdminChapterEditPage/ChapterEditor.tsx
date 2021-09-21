import {
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { ChangeEventHandler, VFC } from 'react'
import { FaRegImage } from 'react-icons/fa'

import { ImageUpload } from '../Shared/ImageUpload'
import { MarkedContentEditor } from './MarkedContentEditor'
import { MarkedContentViewer } from './MarkedContentViewer'

export type ChapterEditorProps = {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  handleUploadImage: ChangeEventHandler<HTMLInputElement>
}

export const ChapterEditor: VFC<ChapterEditorProps> = ({
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
            <MarkedContentViewer content={content} />
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
                  <IconButton
                    aria-label="upload image"
                    icon={<Icon as={FaRegImage} h="6" w="6" color="gray.500" />}
                    isRound
                    bgColor="white"
                    boxShadow="md"
                  />
                </ImageUpload>
              </Center>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  )
}
