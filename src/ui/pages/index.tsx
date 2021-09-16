import 'github-markdown-css'

import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  HStack,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useState, VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'

const IndexPage: VFC = () => {
  const [content, setContent] = useState('')
  const markedContent = useMarked(content)

  return (
    <Box position="absolute" inset="0">
      <Container maxWidth="full" height="100%" py="4">
        <VStack height="100%">
          <Container maxWidth="container.lg">
            <HStack spacing="8" justifyContent="space-between">
              <Text fontWeight="bold">「タイトル」</Text>

              <Tabs size="sm" variant="soft-rounded">
                <TabList>
                  <Tab>本文</Tab>
                  <Tab>基本情報</Tab>
                </TabList>
              </Tabs>
            </HStack>
          </Container>

          <HStack flex="1" alignSelf="stretch" alignItems="stretch">
            <VStack width="50%" alignItems="stretch" spacing="0">
              <Box
                height="32px"
                minHeight="32px"
                border="1px"
                borderBottom="0"
                borderColor="gray.200"
                borderRadius="md"
                backgroundColor="gray.50"
                display="flex"
                justifyContent="end"
                py="1"
                pr="4"
              >
                <Button size="sm" variant="link">
                  画像
                </Button>
              </Box>
              <Textarea
                height="100%"
                resize="none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </VStack>

            <VStack width="50%" alignItems="stretch" spacing="0">
              <Box
                height="32px"
                minHeight="32px"
                border="1px"
                borderBottom="0"
                borderColor="gray.200"
                borderRadius="md"
                backgroundColor="gray.50"
                display="flex"
                justifyContent="start"
                py="1"
                pl="4"
              >
                <HStack>
                  <HStack spacing="0">
                    <Button size="sm" variant="link">
                      <ArrowBackIcon cursor="pointer" color="gray.500" />
                    </Button>
                    <Button size="sm" variant="link">
                      <ArrowForwardIcon cursor="pointer" color="gray.500" />
                    </Button>
                  </HStack>

                  <Text color="gray.500" fontSize="sm" fontWeight="bold">
                    4 / 4
                  </Text>
                </HStack>
              </Box>

              <Box
                flex="1"
                width="100%"
                position="relative"
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <Box
                  className="markdown-body"
                  position="absolute"
                  inset="0"
                  overflow="auto"
                  boxSizing="border-box"
                  minWidth="200px"
                  maxWidth="980px"
                  margin="0 auto"
                  padding="8px 16px"
                  dangerouslySetInnerHTML={{ __html: markedContent }}
                />
              </Box>
            </VStack>
          </HStack>

          <Button alignSelf="end" size="sm">
            保存する
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default IndexPage
