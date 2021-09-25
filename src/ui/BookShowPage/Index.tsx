import { Box, Button, Divider, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { format } from 'date-fns'
import { every } from 'lodash-es'
import { VFC } from 'react'
import { BiCart } from 'react-icons/bi'

import { useMarked } from '@/hooks/useMarked'
import { numberToTwoDigits } from '@/lib/display'
import { Book } from '@/model/book'
import { PublicChapter } from '@/model/publicChapter'
import { UserPageLayout } from '@/ui/Layout/UserPageLayout'
import { BookImage } from '@/ui/Shared/BookImage'

import { useBookShowPageQuery } from './container'

export type BookShowPageProps = {
  book: Book
  publicChapters: PublicChapter[]
}

const BookShowPage: VFC<BookShowPageProps> = ({ book, publicChapters }) => {
  // ui
  const markedDescription = useMarked(book.description)

  return (
    <HStack alignSelf="stretch" alignItems="start" spacing="8">
      <BookImage imageUrl={book.image?.url} size="md" flexShrink={0} />

      <VStack alignItems="start" flex={1}>
        <Box>
          <Text fontWeight="bold" fontSize="2xl">
            {book.title}
          </Text>
          <Text fontWeight="bold" color="gray.500">
            {book.authorNames.join(', ')}
          </Text>
        </Box>

        <Divider />

        <Box className="markdown-body" dangerouslySetInnerHTML={{ __html: markedDescription }} />

        <Divider />

        <VStack alignItems="start">
          <Text fontWeight="bold" fontSize="2xl">
            Chapters
          </Text>
          <VStack alignItems="stretch" spacing="0.5">
            {publicChapters.map((chapter) => (
              <HStack key={chapter.id}>
                <Text fontWeight="bold" fontFamily="mono" color="blue.300">
                  {numberToTwoDigits(chapter.number)}
                </Text>
                <Text color="gray.500" fontWeight="bold">
                  {chapter.title || '無題のチャプター'}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </VStack>

      <Box flexShrink={0} w="60" p="6" borderWidth="3px" borderRadius="md">
        <VStack>
          <Button colorScheme="blue" w="full" leftIcon={<Icon as={BiCart} h="6" w="6" />}>
            カートへ入れる
          </Button>

          <Box alignSelf="stretch">
            <HStack justifyContent="space-between" color="gray.500">
              <Text>発売日</Text>
              <Text>{book.releasedAt ? format(book.releasedAt.toDate(), 'yyyy-MM-dd') : ''}</Text>
            </HStack>

            <HStack justifyContent="space-between" color="gray.500">
              <Text>価格</Text>
              <Text color="black" fontWeight="bold">
                {book.price} 円
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </HStack>
  )
}

const WithLayout = UserPageLayout(BookShowPage)

const Wrapper: VFC = () => {
  const { book, publicChapters } = useBookShowPageQuery()

  return (
    <>
      {every([book, publicChapters], Boolean) && (
        <WithLayout book={book!} publicChapters={publicChapters!} />
      )}
    </>
  )
}

export default Wrapper
