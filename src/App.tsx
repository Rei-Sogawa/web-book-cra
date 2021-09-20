import { VFC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { pathTemplates, routeMap } from '@/routes'

const App: VFC = () => {
  return (
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
  )
}

export default App
