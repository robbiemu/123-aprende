import { KeepAwake, registerRootComponent } from 'expo'
import App from './src/Controllers/App'

import AsyncStorage from '@callstack/async-storage'
AsyncStorage.clear()

if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
