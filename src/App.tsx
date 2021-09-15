import { VFC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { pathTemplates, routeMap } from '@/routes'

const App: VFC = () => {
  return (
    <Router>
      <Switch>
        {pathTemplates.map((pathTemplate) => {
          const { Component } = routeMap[pathTemplate]
          return (
            <Route key={pathTemplate}>
              <Component />
            </Route>
          )
        })}
      </Switch>
    </Router>
  )
}

export default App
