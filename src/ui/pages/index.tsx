import { useState, VFC } from 'react'

import { useMarked } from '@/hooks/useMarked'

const IndexPage: VFC = () => {
  const [content, setContent] = useState('')
  const markedContent = useMarked(content)

  return (
    <div>
      <h1>Index Page</h1>
      <div style={{ display: 'flex' }}>
        <textarea
          style={{ width: '50vh', height: '50vh', resize: 'none', padding: '8px 16px' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div
          style={{
            width: '50vh',
            height: '50vh',
            border: '1px solid',
            padding: '8px 16px',
            marginLeft: '1px',
          }}
          dangerouslySetInnerHTML={{ __html: markedContent }}
        />
      </div>
    </div>
  )
}

export default IndexPage
