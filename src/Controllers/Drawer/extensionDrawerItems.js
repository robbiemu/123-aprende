import { BackHandler, Platform } from 'react-native'
import AsyncStorage from '@callstack/async-storage'

import config from '@src/config/app'

export const drawerItems = config.constants.drawer.items

export function generateItemWithContext (data, context) {
  switch (data.id) {
    case config.constants.drawer.index.logout:
      data.navigate = () => {
        try {
          AsyncStorage.clear()
        } catch (e) {}
        // TODO - reroute to login again in boh windows and ios .   windows is easy - window.location.reload()

        if (Platform.OS === 'ios') {
          BackHandler.exitApp()
        } else {
          window.location.reload()
        }
      }
      break
    default:
      console.warn('no such item for drawer', data, context)
  }

  return data
}
