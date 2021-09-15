import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { ReactNode, VFC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { pathTemplates, routeMap } from '@/routes'

const Header: VFC = () => (
  <HStack h="14" bg="gray.900">
    <Container maxW="container.md">
      <Text color="white" fontWeight="bold">
        Web Book
      </Text>
    </Container>
  </HStack>
)

const Layout: VFC<{ children: ReactNode }> = ({ children }) => (
  <Flex minH="100vh" flexDirection="column" alignItems="stretch">
    <Header />
    <Box flex={1} position="relative">
      {children}
    </Box>
  </Flex>
)

const App: VFC = () => {
  return (
    <Router>
      <Switch>
        {pathTemplates.map((pathTemplate) => {
          const { Component } = routeMap[pathTemplate]
          return (
            <Route key={pathTemplate}>
              <Layout>
                <Component />
              </Layout>
            </Route>
          )
        })}
      </Switch>
    </Router>
  )
}

export default App
