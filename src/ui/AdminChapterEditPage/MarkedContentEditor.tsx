import { VFC } from 'react'

import { UseStateReturn } from '@/types'
import { AutoResizeTextarea } from '@/ui/Shared/AutoResizeTextarea'

export type MarkedContentEditorProps = {
  contentState: UseStateReturn<string>
}

export const MarkedContentEditor: VFC<MarkedContentEditorProps> = ({
  contentState: [content, setContent],
}) => {
  return (
    <AutoResizeTextarea
      placeholder="Write in Markdown"
      _placeholder={{
        fontWeight: 'bold',
      }}
      bg="white"
      minH="440px"
      width="720px"
      value={content}
      onChange={(e) => {
        setContent(e.target.value)
      }}
    />
  )
}
