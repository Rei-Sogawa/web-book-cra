import { Box } from '@chakra-ui/react'
import { VFC } from 'react'

import { UserPageLayout } from '../Layout/UserPageLayout'

export type BookShowPageProps = {}

const BookShowPage: VFC<BookShowPageProps> = () => {
  return <Box></Box>
}

const WithLayout = UserPageLayout(BookShowPage)

const Wrapper: VFC = () => {
  return (
    <>
      <WithLayout />
    </>
  )
}

export default Wrapper
