import { ChangeEventHandler, ReactNode, useRef, VFC } from 'react'

export type ImageUploadProps = {
  children: ReactNode
  onUploadImage: ChangeEventHandler<HTMLInputElement>
}

export const ImageUpload: VFC<ImageUploadProps> = ({ children, onUploadImage }) => {
  // ui
  const inputImageRef = useRef<HTMLInputElement>(null)

  // handler
  const handleClick = () => {
    inputImageRef.current?.click()
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputImageRef}
        style={{ display: 'none' }}
        onChange={onUploadImage}
      />
      <div onClick={handleClick}>{children}</div>
    </div>
  )
}
