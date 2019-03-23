/** The purpose of lib/Auth is to handle authentication with identity authorities. In this case, we are using Auth0.

The only complexity comes in how we handle the successful validation of identity: on any platform we prefer to use BBN data already associated with the backend account, but on iOS if it is not present we can query for it directly with openURL pattern. */

// highly modified from official expo documentation example: https://github.com/expo/auth0-example/blob/master/App.js
import { AuthSession } from 'expo'
import { Platform } from 'react-native'
import { cloneDeep } from 'apollo-utilities'
import uuid from 'uuid/v4'

import config from '@src/config/auth0'
import { default as appConfig } from '@src/config/app'
import { default as AppLinking } from '@src/lib/Linking'
import BaseAuth from './BaseAuth'
import AsyncStorage from '@callstack/async-storage'
import history from '@src/lib/history'
import Device from '@src/Models/Device'
import { getApolloClient } from '@src/lib/Graphcool'

export default class Auth extends BaseAuth {
  async login () {
    const redirectUrl = AuthSession.getRedirectUrl()
    console.info(`Redirect URL (add this to Auth0): ${redirectUrl}`)

    const connectionObject = cloneDeep(config.native.connect)
    this.nonce = uuid()
    connectionObject.nonce = this.nonce

    const self = this
    let authPromise = new Promise(async (resolve, rej) => {
      await AuthSession.startAsync({
        authUrl:
          `${config.native.domain}/authorize` +
          self._toQueryString(connectionObject)
      })
        .then(async result => {
          // window.console.assert(self.nonce === result.nonce, `nonce not matching in ${JSON.stringify(result)} (nonce: ${self.nonce})`)

          if (result.type !== 'success') throw result

          console.trace('login result', result)

          resolve(await self.handleParams(result.params))
        })
        .catch(error => console.error('error', error))
    })

    await (() => authPromise)()

    console.log('login complete')
  }

  _toQueryString (params) {
    return (
      '?' +
      Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
    )
  }

  /** connect to Behavior-based-notifications if it is available */
  async connectToBBN () {
    let uid = await AsyncStorage.getItem(
      appConfig.constants.bbn.connectionDetails.uid
    )

    /* in graphcool, we keep report back to the caller if there was **success** in loading all available information. In the case that it is a new user in graphcool, or a user without any BBN data yet (a user coming from the web), this method is called, but the success state was already set true. It will be overridden with the response back from the method.

        We only want to override that success message in the case that we are going to get data back from bbn -- ie, if we are on iOS.
         */
    let success = Platform.OS !== 'ios'

    if (!uid) {
      console.trace('we don´t have data from BBN, so let´s try to get it')

      AppLinking.register()
    } else {
      success = true

      if (Platform.OS === 'ios') {
        const apolloClient = await getApolloClient()

        const userHasDevice = await apolloClient
          .query({
            query: Device.userHasDevice,
            variables: { deviceIdentifier: Device.currentIdentifier }
          })
          .then(result => {
            return result.data.device
          })
          .catch(err => {
            console.error('error', err)
          })

        if (!userHasDevice) {
          console.trace(
            'we have a uid, but this device isn´t in associated with this user yet'
          )

          AppLinking.register()
        }
      } else {
        console.trace(
          'no need to register app/device pair, already satisfied w/ uid: ',
          uid
        )
      }

      return success
    }
  }

  async handleParams (responseObj) {
    if (!history) return console.warn('Auth0 instantiated without history!')

    const authResult = {
      accessToken: responseObj.access_token,
      idToken: responseObj.id_token,
      expiresIn: +responseObj.expires_in
    }

    await this.handleAuthResult({ authResult, err: responseObj.error })

    history.replace('/')
  }
}
