import 'github-markdown-css'

import { Box } from '@chakra-ui/react'
import { VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'

export type MarkedContentViewerProps = {
  content: string
}

export const MarkedContentViewer: VFC<MarkedContentViewerProps> = ({ content }) => {
  const markedContent = useMarked(content)

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxSizing="border-box"
      minHeight="440px"
      width="720px"
      boxShadow="md"
    >
      <Box
        className="markdown-body"
        padding="8px 16px"
        dangerouslySetInnerHTML={{ __html: markedContent }}
      />
    </Box>
  )
}
