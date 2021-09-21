import { ChangeEventHandler, VFC } from 'react'

import { AutoResizeTextarea } from '@/ui/Shared/AutoResizeTextarea'

export type MarkedContentEditorProps = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export const MarkedContentEditor: VFC<MarkedContentEditorProps> = ({ value, onChange }) => {
  return (
    <AutoResizeTextarea
      placeholder="Write in Markdown"
      _placeholder={{
        fontWeight: 'bold',
      }}
      bg="white"
      minH="440px"
      width="720px"
      value={value}
      onChange={onChange}
    />
  )
}
