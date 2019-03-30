// Here, we handle interaction of data between two datasources: graphcool and the BBN app for the user. We want to ensure that the BBN user specific information is in the graphcool store - particularly the uid, which we will use to qualify the reporting of our metric data.

import AsyncStorage from '@callstack/async-storage'
import history from '@src/lib/history'
import { default as appConfig } from '@src/config/app'
import { getRawClient, getFirebaseToken } from './index'
import User from '@src/Models/User'
import Token from '@src/Models/Token'
import Device from '@src/Models/Device'
import DeviceTokenPair from '@src/Models/DeviceTokenPair'

/** relayBBNToGraphcool - (iOS only) after BBN connectionDetails have been set
 * in asyncStorage, we are ready to convey them to graphcool so we won't need
 * to openURL for them again.
 * notes:
 * If we are being called, the user has been on the splash screen, waiting for
 * completion from BBN to navigate /home, so we'll do that now too.
 *
 * If we are being called, the user has not yet received a firebase token, so
 * we will get that upon completions
 *
 * it is possible for users to cycle login fast enough to get two of these
 * going simultaneously
 */
export const relayBBNToGraphcool = async () => {
  history.replace(appConfig.appHome)

  const apolloClient = await getRawClient()

  const bundleIdentifier = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.bundle
  )
  const userIdentifier = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.uid
  )

  const deviceToken = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.token
  )

  const deviceIdentifier = Device.currentIdentifier()

  console.log(
    'saving to graphcool the BBN data',
    /* , await AsyncStorage.getItem('graphcool_token'), bundleIdentifier, userIdentifier, */ deviceToken,
    deviceIdentifier
  )

  apolloClient
    .query({ query: User.self, forceFetch: true })
    .then(userPayload => {
      const user = userPayload.data.user

      if (user === null) throw new Error('no user')

      console.log('1 creating Token for user', `deviceToken: ${deviceToken}`)

      apolloClient
        .mutate({
          mutation: Token.createToken,
          variables: {
            deviceToken,
            userId: user.id
          }
        })
        .then(tokenPayload => {
          const token = tokenPayload.data.createToken

          console.log(
            '2 creating Device for user',
            `deviceIdentifier: ${deviceIdentifier}, tokenId: ${token.id}`
          )

          apolloClient
            .mutate({
              mutation: Device.createDevice,
              variables: {
                deviceIdentifier,
                userId: user.id
              }
            })
            .then(devicePayload => {
              const device = devicePayload.data.createDevice

              console.log(
                '3 updating user',
                `bundleIdentifier: ${bundleIdentifier}, userIdentifier: ${userIdentifier}`
              )

              const devicesIds = user.devices
                .map(device => device.id)
                .concat(device.id)

              const tokensIds = user.tokens
                .map(token => token.id)
                .concat(token.id)

              apolloClient.mutate({
                mutation: User.updateUser,
                variables: {
                  id: user.id,
                  devicesIds,
                  tokensIds,
                  bundleIdentifier,
                  userIdentifier
                }
              })

              console.log('4 updating Token/Device pair')

              apolloClient
                .mutate({
                  mutation: DeviceTokenPair.setDeviceOnToken,
                  variables: {
                    tokenTokenId: token.id,
                    deviceDeviceId: device.id
                  }
                })
                .then(() => {
                  getFirebaseToken()
                })
            })
        })
    })
    .catch(err => console.error('error verifying self', err))
}
