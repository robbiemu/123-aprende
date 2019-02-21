import { Constants } from 'expo'
import { Platform } from 'react-native'

import console from '@src/lib/console'

const SOURCE = 'Models/Device - identifier - native'
console.setPreface(SOURCE)

export const currentIdentifier = function () {
  switch (Platform.OS) {
    case 'ios':
      return Constants.deviceId
    default:
      console.warn('unknown platform')
  }
}
