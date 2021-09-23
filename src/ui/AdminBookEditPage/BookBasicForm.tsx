import { Box, Button, HStack, Image, Input, Text, VStack } from '@chakra-ui/react'
import { head } from 'lodash-es'
import { ChangeEventHandler, Dispatch, SetStateAction, VFC } from 'react'

import { Book } from '@/model/book'
import { AutoResizeTextarea } from '@/ui/Shared/AutoResizeTextarea'
import { ImageUpload } from '@/ui/Shared/ImageUpload'

type UseStateReturn<T> = [T, Dispatch<SetStateAction<T>>]

export type BookBasicFormProps = {
  titleState: UseStateReturn<string>
  descriptionState: UseStateReturn<string>
  image: Book['image']
  onUploadBookCover: (file: File) => Promise<void>
  onDeleteBookCover: () => Promise<void>
}

export const BookBasicForm: VFC<BookBasicFormProps> = ({
  titleState: [title, setTitle],
  descriptionState: [description, setDescription],
  image,
  onUploadBookCover,
  onDeleteBookCover,
}) => {
  // handler
  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = head(e.target.files)
    if (!file) return
    await onUploadBookCover(file)
  }

  return (
    <HStack spacing="8">
      <VStack alignSelf="start">
        <Box
          width="200px"
          height="280px"
          bg="gray.100"
          borderRadius="md"
          boxShadow="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {image ? (
            <Image src={image.url} />
          ) : (
            <Text fontWeight="bold" fontSize="2xl" color="gray.500" pb="8">
              Web Book
            </Text>
          )}
        </Box>

        <HStack alignItems="center" spacing="0">
          <Button variant="link" fontSize="sm">
            <ImageUpload onUploadImage={handleUploadImage}>
              <Text>画像を設定</Text>
            </ImageUpload>
          </Button>

          {image && (
            <>
              <Text fontWeight="bold" fontSize="sm" color="gray.500" pl="1.5" pb="1">
                /
              </Text>
              <Button variant="link" fontSize="sm" px="0" onClick={onDeleteBookCover}>
                削除
              </Button>
            </>
          )}
        </HStack>
      </VStack>

      <VStack flex="1" alignSelf="stretch">
        <Input
          placeholder="本のタイトル"
          size="lg"
          fontWeight="bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Box flex="1" alignSelf="stretch">
          <AutoResizeTextarea
            placeholder="内容紹介"
            minH="100%"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </VStack>
    </HStack>
  )
}
