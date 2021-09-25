import { Box, Container } from '@chakra-ui/react'
import { ReactNode, VFC } from 'react'

export type HeaderWrapperProps = {
  children: ReactNode
}

export const HeaderWrapper: VFC<HeaderWrapperProps> = ({ children }) => {
  return (
    <Box h="14" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm" bg="white">
      <Container maxW="container.lg" h="full">
        {children}
      </Container>
    </Box>
  )
}
