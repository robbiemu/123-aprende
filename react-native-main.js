import { KeepAwake, registerRootComponent } from 'expo'

import App from './src/Controllers/App'

// // for debugging
// import AsyncStorage from '@callstack/async-storage'
// import config from '@src/config/app'
// try {
//   AsyncStorage.clear()
//   AsyncStorage.setItem('appName', config.appName)
// } catch (e) {
// }

if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
