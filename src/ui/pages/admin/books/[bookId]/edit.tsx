import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useParams } from 'react-router'

import { ChapterService } from '@/service/chapter'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'

type HeaderProps = {
  onClickSave: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ onClickSave }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack>
            <Button variant="link" p="1">
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Button>
          </HStack>

          <Button colorScheme="blue" onClick={onClickSave}>
            保存する
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}

const BookEditPage: VFC = () => {
  const { bookId } = useParams<{ bookId: string }>()

  const handleClickAddChapter = async () => {
    await ChapterService.createDoc({ title: '無題のチャプター' }, { bookId })
  }

  return (
    <VStack minHeight="100vh">
      <Box alignSelf="stretch">
        <Header onClickSave={() => Promise.resolve()} />
      </Box>

      <Container maxW="container.md" py="8">
        <HStack alignSelf="stretch" spacing="8">
          <VStack spacing="3">
            <Box
              cursor="pointer"
              width="210px"
              height="300px"
              bg="gray.50"
              borderRadius="md"
              boxShadow="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" fontSize="2xl" color="gray.500" pb="8">
                Book Cover
              </Text>
            </Box>
            <Button variant="link" fontWeight="normal" fontSize="sm">
              カバー画像を変更
            </Button>
          </VStack>

          <VStack flex="1" alignSelf="stretch">
            <Input placeholder="本のタイトル" size="lg" fontWeight="bold" />
            <AutoResizeTextarea flex="1" placeholder="内容紹介" />
          </VStack>
        </HStack>
      </Container>

      <Box flex="1" bg="gray.50" alignSelf="stretch">
        <Container maxW="container.md" py="8">
          <VStack spacing="8">
            <Heading alignSelf="start">Chapters</Heading>

            <VStack alignSelf="stretch" alignItems="stretch" spacing="0.5">
              <Box h="60px" bg="white"></Box>
            </VStack>

            <Button
              alignSelf="stretch"
              size="lg"
              colorScheme="blue"
              variant="outline"
              leftIcon={<AddIcon />}
              onClick={handleClickAddChapter}
            >
              チャプターを追加
            </Button>
          </VStack>
        </Container>
      </Box>
    </VStack>
  )
}

export default BookEditPage
