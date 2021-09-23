import { VFC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { pathTemplates, routeMap } from '@/routes'
import { AuthProvider } from '@/service/auth'

const App: VFC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {pathTemplates.map((pathTemplate, index) => {
            const { Component, exact } = routeMap[pathTemplate]

            return (
              <Route key={index} path={pathTemplate} exact={exact}>
                <Component />
              </Route>
            )
          })}
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
