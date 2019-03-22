import { KeepAwake, registerRootComponent } from 'expo'
import App from './src/Controllers/App'

if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
