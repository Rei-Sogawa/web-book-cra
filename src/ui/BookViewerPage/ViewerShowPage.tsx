import { Box, Container, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'
import { Chapter } from '@/model/chapter'

export type ViewerShowPageProps = {
  chapter: Chapter
}

export const ViewerShowPage: VFC<ViewerShowPageProps> = ({ chapter }) => {
  // ui
  const markedContent = useMarked(chapter.content)

  return (
    <VStack maxH="100vh" overflow="auto">
      <Box alignSelf="stretch" bg="gray.50">
        <Container maxW="container.md" py="8">
          <VStack alignItems="start">
            <Text fontWeight="bold" color="gray.500" fontSize="lg">
              Chapter {chapter.number.toString().padStart(2, '0')}
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {chapter.title || '無題のチャプター'}
            </Text>
          </VStack>
        </Container>
      </Box>
      <Container maxW="container.md" py="8">
        <Box
          className="markdown-body"
          padding="8px 0px"
          dangerouslySetInnerHTML={{ __html: markedContent }}
        />
      </Container>
    </VStack>
  )
}
