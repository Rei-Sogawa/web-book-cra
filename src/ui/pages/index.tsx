import { Box, Button, Container, Heading, HStack, Textarea, VStack } from '@chakra-ui/react'
import { useState, VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'

const IndexPage: VFC = () => {
  const [content, setContent] = useState('')
  const markedContent = useMarked(content)

  return (
    <Box position="absolute" inset="0">
      <Container maxW="container.lg" height="100%" py="4">
        <VStack height="100%" alignItems="stretch">
          <Heading>Index Page</Heading>

          <HStack flex="1" alignItems="stretch">
            <Box width="50%">
              <Textarea
                height="100%"
                resize="none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Box>

            <Box
              width="50%"
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              position="relative"
            >
              <div
                className="marked"
                style={{ position: 'absolute', inset: '0', overflow: 'auto' }}
                dangerouslySetInnerHTML={{ __html: markedContent }}
              />
            </Box>
          </HStack>

          <Button alignSelf="end">Submit</Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default IndexPage
