import { Linking, Alert } from 'react-native'
import AsyncStorage from '@callstack/async-storage'
import Url from 'url'

import { relayBBNToGraphcool } from '@src/lib/Graphcool'
import config from '@src/config/app'
import history from '@src/lib/history'

export default {
  /** on iOS, request contection details by url */
  async register () {
    const appid = config.appId

    console.log('registering app id as', appid)

    const notify = await getExpoNotification()

    const urlize = uri =>
      `bbn://register?appname=${
        config.appName
      }&notify=${notify}&callback=${uri}?action=${
        config.constants.urls.connectionDetails
      }&appid=${appid}`

    console.info('opening', urlize(config.appScheme))

    const lastOpenDate = await getLastOpenDate()

    const SIX_MONTHS = 60 * 60 * 24 * 1000 * (365 / 2)
    const sufficientlyLater = lastOpenDate
      ? new Date() - lastOpenDate > SIX_MONTHS
      : false

    Linking.getInitialURL()
      .then(uri => {
        Linking.openURL(urlize(uri)).catch(error => {
          console.warn('error', error)

          if (!lastOpenDate || sufficientlyLater) {
            Alert.alert(
              'Notice',
              'Behavior-based-notifications is not installed'
            )
            AsyncStorage.setItem('linkingLastOpenBBN', new Date())
          }
          history.replace(config.appHome)
        })
      })
      .catch(err => {
        console.warn('Linking error', err)
      })
  },

  async requestConnectionDetails () {
    const notify = await getExpoNotification()

    let urlize = (uri, auth) =>
      `bbn://connectionDetails?appname=third-party-demo&notify=${notify}&callback=${uri}?action=${
        config.constants.urls.connectionDetails
      }`

    console.info('opening', urlize('expo'))

    const lastOpenDate = await getLastOpenDate()

    const SIX_MONTHS = 60 * 60 * 24 * 1000 * (365 / 2)
    const sufficientlyLater = lastOpenDate
      ? new Date() - lastOpenDate > SIX_MONTHS
      : false

    Linking.getInitialURL()
      .then(uri => {
        Linking.openURL(urlize(uri)).catch(error => {
          console.warn('error', error)

          if (!lastOpenDate || sufficientlyLater) {
            Alert.alert(
              'Notice',
              'Behavior-based-notifications is not installed'
            )
            AsyncStorage.setItem('linkingLastOpenBBN', new Date())
          }
        })
      })
      .catch(err => {
        console.warn('Linking error', err)
      })
  },

  /** onOpen - register connectionDetails from BBN.
   * note: this will only happen on iOS
   */
  onOpen (url) {
    console.log('onOpen url ', url)

    const parseQuery = true
    const resource = Url.parse(url, parseQuery)
    if (!resource.query) {
      console.warn('Linking error - unknown url', url)
      return
    }

    switch (resource.query.action) {
      case config.constants.urls.connectionDetails:
        this.onConnectionDetails(resource.query)
        return
      default:
        console.warn('Linking error - unknown url', url)
    }
  },

  /** onConnectionDetails - set items to storage
   * query - the connection details from BBN
   */
  async onConnectionDetails (query) {
    // console.log('success', query)

    if (query.appid !== config.appId) return

    await AsyncStorage.setItem(
      config.constants.bbn.connectionDetails.token,
      query.token
    )
    await AsyncStorage.setItem(
      config.constants.bbn.connectionDetails.bundle,
      query.bundle
    )
    await AsyncStorage.setItem(
      config.constants.bbn.connectionDetails.uid,
      query.uid
    )

    relayBBNToGraphcool()
  }
}

async function getExpoNotification () {
  console.log('getting expo token')
  console.log('all keys', await AsyncStorage.getAllKeys())

  let expoToken
  try {
    expoToken = await AsyncStorage.getItem('expoToken')
    console.log('rendering expo token', expoToken)
  } catch (e) {
    console.info(e)
  }
  console.log('got', expoToken)

  return JSON.stringify({
    token: expoToken,
    body: {
      to: expoToken,
      badge: 0,
      _category: '@user/experienceId:notification'
    }
  })
}

async function getLastOpenDate () {
  let lastOpen
  try {
    lastOpen = await AsyncStorage.getItem('linkingLastOpenBBN')
  } catch (e) {
    console.info(e)
  }
  return lastOpen ? new Date(lastOpen) : null
}
