import { KeepAwake, registerRootComponent } from 'expo'
import App from './src/Controllers/App'

import AsyncStorage from '@callstack/async-storage'
try {
  AsyncStorage.clear()
} catch (e) {
  // no error
}
debugger
if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
