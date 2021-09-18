import { AddIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { ReactNode, VFC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { pathTemplates, routeMap } from '@/routes'

// const Header: VFC = () => {
//   return (
//     <HStack
//       h="14"
//       backgroundColor="gray.50"
//       borderBottom="1px"
//       borderBottomColor="gray.200"
//       boxShadow="sm"
//     >
//       <Container maxW="container.lg">
//         <HStack justifyContent="space-between">
//           <Text fontWeight="extrabold" fontSize="2xl">
//             Web Book
//           </Text>

//           <HStack spacing="8">
//             <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
//               本を作る
//             </Button>
//             <Avatar size="sm" />
//           </HStack>
//         </HStack>
//       </Container>
//     </HStack>
//   )
// }

// const Layout: VFC<{ children: ReactNode }> = ({ children }) => (
//   <Flex minH="100vh" flexDirection="column" alignItems="stretch">
//     <Header />
//     <Box flex="1" position="relative">
//       {children}
//     </Box>
//   </Flex>
// )

const App: VFC = () => {
  return (
    <Router>
      <Switch>
        {pathTemplates.map((pathTemplate, index) => {
          const { Component } = routeMap[pathTemplate]
          return (
            <Route key={index} path={pathTemplate} exact={true}>
              <Component />
            </Route>
          )
        })}
      </Switch>
    </Router>
  )
}

export default App
