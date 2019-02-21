import { Platform } from 'react-native'
import AsyncStorage from '@callstack/async-storage'
import uuid from 'uuid/v4'

import console from '@src/lib/console'

const SOURCE = 'Models/Device - identifier - web'
console.setPreface(SOURCE)

export const currentIdentifier = function () {
  switch (Platform.OS) {
    case 'web':
      let key = AsyncStorage.getItem('deviceIdentifier')
      if (!key) {
        key = uuid()
        AsyncStorage.setItem('deviceIdentifier', key)
      }

      return key
    default:
      console.warn('unknown platform')
  }
}
