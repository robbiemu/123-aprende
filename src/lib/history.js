import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { Platform } from 'react-native'

import console from '@src/lib/console'

const SOURCE = 'src/lib/history.js'
console.setPreface(SOURCE)

const customHistory = (() => {
  switch (Platform.OS) {
    case 'web':
      return createBrowserHistory()
    case 'ios':
      return createMemoryHistory()
    default:
      console.error(`No such platform configuration ${Platform.OS}`)
  }
})()

export default customHistory
