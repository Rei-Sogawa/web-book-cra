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

import { UseStateReturn } from '@/types'
import { ImageUpload } from '@/ui/Shared/ImageUpload'

import { MarkedContentEditor } from './MarkedContentEditor'
import { MarkedContentViewer } from './MarkedContentViewer'

export type ChapterEditorProps = {
  titleState: UseStateReturn<string>
  contentState: UseStateReturn<string>
  handleUploadImage: ChangeEventHandler<HTMLInputElement>
}

export const ChapterEditor: VFC<ChapterEditorProps> = ({
  titleState: [title, setTitle],
  contentState,
  handleUploadImage,
}) => {
  // ui
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
            <MarkedContentViewer content={contentState[0]} />
          ) : (
            <MarkedContentEditor contentState={contentState} />
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
