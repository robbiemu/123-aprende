import { KeepAwake, registerRootComponent } from 'expo'
import AsyncStorage from '@callstack/async-storage'

import config from '@src/config/app'
import App from './src/Controllers/App'

try {
  AsyncStorage.clear()
  AsyncStorage.setItem('appName', config.appName)
} catch (e) {
  // no error
}

if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
