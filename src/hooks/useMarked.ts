import DOMPurify from 'dompurify'
import marked from 'marked'
import { useMemo } from 'react'

export const useMarked = (content: string) => {
  const markedContent = useMemo(() => DOMPurify.sanitize(marked(content)), [content])
  return markedContent
}
