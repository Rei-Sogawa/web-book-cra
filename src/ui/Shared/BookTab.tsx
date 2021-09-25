import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { last } from 'lodash-es'
import { VFC } from 'react'
import { useHistory } from 'react-router'

type Path = 'books' | 'library'

type TabName = 'Books' | 'Library'

const PATH_AND_TAB_NAMES: [Path, TabName][] = [
  ['books', 'Books'],
  ['library', 'Library'],
]

export const BookTab: VFC = () => {
  // app
  const history = useHistory()
  const lastPathname = last(history.location.pathname.split('/')) as Path

  // ui
  const isActive = ([path, _]: [Path, TabName]) => path === lastPathname
  const activeIndex = PATH_AND_TAB_NAMES.findIndex(isActive)

  // handler
  const handleClickTab = ([path, _]: [Path, TabName]) => {}

  return (
    <Tabs index={activeIndex}>
      <TabList>
        {PATH_AND_TAB_NAMES.map((pathAndTab) => (
          <Tab
            fontSize="xl"
            fontWeight="bold"
            color={isActive(pathAndTab) ? 'blue' : 'gray.500'}
            onClick={() => handleClickTab(pathAndTab)}
          >
            {pathAndTab[1]}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
