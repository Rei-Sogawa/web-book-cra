import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Container, HStack, Icon, Input, Link, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'

import { routeMap } from '@/routes'
import { ChapterService, useChapters } from '@/service/chapter'
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
            <Link as={ReactRouterLink} to={routeMap['/'].path()}>
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
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

  const chapters = useChapters({ bookId })

  const handleClickAddChapter = async () => {
    await ChapterService.createDoc(
      { title: '無題のチャプター', number: chapters!.length + 1 },
      { bookId }
    )
  }

  return (
    <VStack minHeight="100vh">
      <Box alignSelf="stretch">
        <Header onClickSave={() => Promise.resolve()} />
      </Box>

      <Container maxW="container.md" py="8">
        <HStack alignSelf="stretch" spacing="8">
          <VStack spacing="3" alignSelf="start">
            <Box
              cursor="pointer"
              width="210px"
              height="300px"
              bg="gray.100"
              borderRadius="md"
              boxShadow="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" fontSize="2xl" color="gray.500" pb="8">
                Web Book
              </Text>
            </Box>
            <Button variant="link" fontWeight="normal" fontSize="sm">
              カバー画像を変更
            </Button>
          </VStack>

          <VStack flex="1" alignSelf="stretch">
            <Input placeholder="本のタイトル" size="lg" fontWeight="bold" fontSize="2xl" />
            <Box flex="1" alignSelf="stretch">
              <AutoResizeTextarea placeholder="内容紹介" minH="100%" />
            </Box>
          </VStack>
        </HStack>
      </Container>

      <Box flex="1" bg="gray.50" alignSelf="stretch">
        <Container maxW="container.md" py="8">
          <VStack spacing="8">
            <Text alignSelf="start" fontWeight="bold" fontSize="2xl">
              Chapters
            </Text>

            {chapters?.length && (
              <VStack alignSelf="stretch" alignItems="stretch" spacing="0.5">
                {chapters.map((chapter) => (
                  <HStack key={chapter.id} bg="white" py="4" px="8" spacing="8">
                    <Text fontWeight="bold" fontSize="lg" fontFamily="mono" color="blue.300">
                      {chapter.number.toString().padStart(2, '0')}
                    </Text>
                    <Link
                      as={ReactRouterLink}
                      to={routeMap['/admin/books/:bookId/chapters/:chapterId/edit'].path({
                        bookId,
                        chapterId: chapter.id,
                      })}
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      {chapter.title}
                    </Link>
                  </HStack>
                ))}
              </VStack>
            )}

            <Button
              alignSelf="stretch"
              size="lg"
              variant="outline"
              color="gray.500"
              _hover={{ background: 'white' }}
              _active={{ background: 'white' }}
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
