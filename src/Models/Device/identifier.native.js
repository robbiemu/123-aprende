import { Constants } from 'expo'
import { Platform } from 'react-native'

export const currentIdentifier = function () {
  switch (Platform.OS) {
    case 'ios':
      return Constants.deviceId
    default:
      console.warn('unknown platform')
  }
}
