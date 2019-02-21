import gql from 'graphql-tag'

import DeviceTokenPair from '@src/Models/DeviceTokenPair'
import { currentIdentifier } from './identifier'

export default class Device extends DeviceTokenPair {
  constructor ({ deviceIdentifier, user, token } = {}) {
    super()

    this.deviceIdentifier = deviceIdentifier
    this.user = user
    this.token = token
  }

  static currentIdentifier = currentIdentifier

  static userHasDevice = gql`
    query($deviceIdentifier: String!) {
      device(deviceIdentifier: $deviceIdentifier) {
        id
      }
    }
  `

  static createDevice = gql`
    mutation($deviceIdentifier: String!, $userId: ID!) {
      createDevice(deviceIdentifier: $deviceIdentifier, userId: $userId) {
        id
      }
    }
  `

  static updateDevice = gql`
    mutation($id: ID!, $deviceIdentifier: String, $tokenId: ID, $userId: ID!) {
      updateDevice(
        id: $id
        deviceIdentifier: $deviceIdentifier
        tokenId: $tokenId
        userId: $userId
      ) {
        id
      }
    }
  `

  static isValid (device) {
    return (
      device.deviceIdentifier &&
      device.token instanceof DeviceTokenPair &&
      this.token.deviceToken &&
      device.token.isValid()
    )
  }

  isValidForDeviceToken (deviceToken) {
    return (
      deviceToken &&
      this.token instanceof DeviceTokenPair &&
      this.token.deviceToken &&
      this.token.deviceToken === deviceToken
    )
  }
}
