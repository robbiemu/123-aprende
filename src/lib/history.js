import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { Platform } from 'react-native'

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

// Get the current location.
export const location = customHistory.location;

/*
// Listen for changes to the current location.
const unlisten = customHistory.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state);
});
*/

export default customHistory
