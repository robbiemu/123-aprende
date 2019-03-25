// Here, we handle interaction of data between two datasources: graphcool and the identitty authority auth0. We want to allow the user to assign an identity to associate with their BBN app for the reporting of metric data, so there is a User table in graphcool that pairs BBN data with their identity. here, we create the record for the identity, albeit with blank info for BBN data (since that comes from the other app)

import AsyncStorage from '@callstack/async-storage'
import { Platform } from 'react-native'

import { default as appConfig } from '@src/config/app'
import { getRawClient } from './index'
import User from '@src/Models/User'
import { getFirebaseToken } from './extensionFirebase'

/** after auth0 authentication, we need to user our credentials to sign in/create an account */
export async function relayAuthToGraphcool ({ auth0 } = {}) {
  console.trace('relayAuthToGraphcool')
  let apolloClient = await getRawClient()

  const idToken = await AsyncStorage.getItem('id_token') // auth0's identity token

  console.trace(
    'ensuring graphcool authentication. hasToken?: ',
    typeof idToken === 'string'
  )

  let success = false

  // verify we are logged in
  await apolloClient
    .query({ query: User.self, forceFetch: true })
    .then(async initial => {
      if (!initial.data.user) {
        // we didn't sign in?
        console.trace('must sign in to graphcool', initial.data)

        await apolloClient
          .mutate({
            mutation: User.authenticateUser,
            variables: { accessToken: idToken }
          })
          .then(async results => {
            console.trace('signin successful', results)

            await AsyncStorage.setItem(
              'graphcool_token',
              results.data.authenticateUser.token
            )
            // not sure why this is necessary -- I had defined this as const at first but found that the token was not being updated. when I console.log the token from the same source, it shows: reinitializing seems to solve -- may be an optimiation issue
            apolloClient = await getRawClient()

            console.trace('verifying signin success')
            await apolloClient
              .query({ query: User.self, forceFetch: true })
              .then(async ({ data }) => {
                console.warn('success:', data.user)

                await _setStorageItems(data.user)

                success = await _conditionallyLoadBBNData(auth0)
              })
              .catch(err => console.error(err))
          })
          .catch(err => console.error('error', err))
      } else {
        console.trace('data', initial.data)

        await _setStorageItems(initial.data.user)

        success = await _conditionallyLoadBBNData(auth0)
      }
    })
    .catch(err => console.error('error verifying self', err))

  // const user = new User({userIdentifier: idToken})

  return success
}

/** helper method to:
 * set BBN data from graphcool user data to storage as if connected from BBN
 * directly set graphcool data as necessary for simple authentication
 * requirements in graphcool
 **/
async function _setStorageItems (user) {
  console.trace('setting BBN storage items from graphcool user data')
  if (user.bundleIdentifier) {
    await AsyncStorage.setItem(
      appConfig.constants.bbn.connectionDetails.bundle,
      user.bundleIdentifier
    )
  }
  if (user.userIdentifier) {
    await AsyncStorage.setItem(
      appConfig.constants.bbn.connectionDetails.uid,
      user.userIdentifier
    )
  }

  console.log('setting graphcool storage items')
  if (user.id) {
    await AsyncStorage.setItem(appConfig.constants.graphcool.user_id, user.id)
  }
  if(user.progress) {
    console.log(`user progress: writing string of >>${JSON.stringify(user.progress)}<< original's type: '${typeof user.progress}'`)
    await AsyncStorage.setItem(
        appConfig.constants.graphcool.progress,
        Platform.OS === 'ios' ? JSON.stringify(user.progress): user.progress
    )
  }
}

/** helper method to determine if we need to load BBN data from Linking.js, or if we have restored all the data we need from graphcool */
async function _hasSufficientBBNData () {
  const hasBundle = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.bundle
  )
  const hasUid = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.uid
  )

  return !!(hasBundle && hasUid)
}

/** login completion method conditionally requests BBN data */
async function _conditionallyLoadBBNData (auth0) {
  let hasSufficientBBNData = await _hasSufficientBBNData()
  if (Platform.OS === 'ios') {
    if (!hasSufficientBBNData) {
      console.log(`finally, connect to bbn (if on iOS. OS is: ${Platform.OS})`)

      return auth0.connectToBBN()
    } else {
      getFirebaseToken()
      return true
    }
  } else {
    return true
  }
}
