import gql from 'graphql-tag'

import DeviceTokenPair from '@src/Models/DeviceTokenPair'

export default class Token extends DeviceTokenPair {
  constructor ({ deviceToken, device } = {}) {
    super()

    this.deviceToken = deviceToken
    this.device = device
  }

  static isValid (token) {
    return !!token.deviceToken
  }

  static createToken = gql`
    mutation($deviceToken: String!, $userId: ID!) {
      createToken(deviceToken: $deviceToken, userId: $userId) {
        id
      }
    }
  `

  isValidForDeviceIdentifier (deviceIdentifier) {
    return (
      deviceIdentifier &&
      this.device instanceof DeviceTokenPair &&
      this.device.deviceIdentifier &&
      this.device.deviceIdentifier === deviceIdentifier
    )
  }
}
