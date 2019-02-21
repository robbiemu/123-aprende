import gql from 'graphql-tag'

export default class DeviceTokenPair {
  static setDeviceOnToken = gql`
    mutation($tokenTokenId: ID!, $deviceDeviceId: ID!) {
      setDeviceOnToken(
        tokenTokenId: $tokenTokenId
        deviceDeviceId: $deviceDeviceId
      ) {
        deviceDevice {
          id
        }
        tokenToken {
          id
        }
      }
    }
  `
} // helper class to evade a circular dependency in instanceOf check
