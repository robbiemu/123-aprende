import { isEqual } from 'apollo-utilities'
import gql from 'graphql-tag'

import Device from './Device/index'
import Token from '@src/Models/Token'

export default class User {
  constructor ({ userIdentifier, bundleIdentifier, devices } = {}) {
    this.userIdentifier = userIdentifier
    this.bundleIdentifier = bundleIdentifier
    if (Array.isArray(devices)) {
      this.devices = devices.filter(device => device instanceof Device)
    } else if (typeof devices === 'object') {
      if (
        Object.entries(devices).every(
          pair => typeof pair[0] === 'string' && typeof pair[1] === 'string'
        )
      ) {
        this.devices = Object.keys(devices).map(deviceIdentifier => {
          const device = new Device({ deviceIdentifier, user: this })
          device.token = new Token({
            deviceToken: devices[deviceIdentifier],
            device
          })

          return device
        })
      }
    } else {
      this.devices = []
    }
  }

  static authenticateUser = gql`
    mutation($accessToken: String!) {
      authenticateUser(accessToken: $accessToken) {
        id
        token
      }
    }
  `

  static createUser = gql`
    mutation($authProvider: AuthProviderSignupData!) {
      createUser(authProvider: $authProvider) {
        id
      }
    }
  `

  static updateUser = gql`
    mutation(
      $id: ID!
      $userIdentifier: String
      $bundleIdentifier: String
      $devicesIds: [ID!]
      $tokensIds: [ID!]
    ) {
      updateUser(
        id: $id
        userIdentifier: $userIdentifier
        bundleIdentifier: $bundleIdentifier
        devicesIds: $devicesIds
        tokensIds: $tokensIds
      ) {
        id
      }
    }
  `

  static getFirebaseToken = gql`
    query($userIdentifier: String!) {
      getFirebaseToken(userIdentifier: $userIdentifier) {
        token
      }
    }
  `

  static self = gql`
    query {
      user {
        id
        auth0UserId
        userIdentifier
        bundleIdentifier
        devices {
          id
        }
        tokens {
          id
        }
      }
    }
  `

  static signinUser = gql`
    mutation($idToken: String!) {
      signinUser(auth0: { idToken: $idToken }) {
        token
        user {
          id
          auth0UserId
          bundleIdentifier
          userIdentifier
        }
      }
    }
  `

  isValidForDevice (user, device) {
    return (
      this.userIdentifier &&
      this.bundleIdentifier &&
      this.devices.some(d => isEqual(d, device)) &&
      device instanceof Device &&
      Device.isValid(device)
    )
  }

  isValidForDeviceToken (user, deviceToken) {
    const device = this.devices.find(d => d.token.deviceToken === deviceToken)

    return (
      deviceToken &&
      device instanceof Device &&
      Device.isValid(device) &&
      this.userIdentifier &&
      this.bundleIdentifier
    )
  }
}
