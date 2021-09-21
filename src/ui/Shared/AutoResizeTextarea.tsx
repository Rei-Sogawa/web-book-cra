import { Textarea, TextareaProps } from '@chakra-ui/react'
import { ForwardedRef, forwardRef } from 'react'
import ResizeTextarea from 'react-textarea-autosize'

// https://github.com/chakra-ui/chakra-ui/issues/670#issuecomment-669916624
export const AutoResizeTextarea = forwardRef(
  (props: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <Textarea
        overflow="hidden"
        resize="none"
        ref={ref}
        minRows={1}
        as={ResizeTextarea}
        {...props}
      />
    )
  }
)
