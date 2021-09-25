import { Box, Container, Divider, HStack, Text, VStack } from '@chakra-ui/layout'
import { VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'
import { Book } from '@/model/book'
import { BookImage } from '@/ui/Shared/BookImage'

export type ViewerPageProps = { book: Book }

export const ViewerPage: VFC<ViewerPageProps> = ({ book }) => {
  // ui
  const markedDescription = useMarked(book.description)

  return (
    <Container maxW="container.md" py="8">
      <HStack alignItems="start" spacing="8">
        <Box>
          <BookImage imageUrl={book.image?.url} size="md" />
        </Box>

        <VStack alignItems="start">
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
        </VStack>
      </HStack>
    </Container>
  )
}
