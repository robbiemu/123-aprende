import { Linking, Alert } from 'react-native'
import AsyncStorage from '@callstack/async-storage'
import Url from 'url'

import { relayBBNToGraphcool } from '@src/lib/Graphcool'
import config from '@src/config/app'


export default {
  /** on iOS, request contection details by url */
  async register () {
    const appid = config.appId

    console.trace('registering app id as', appid)

    const urlize = uri =>
      `bbn://register?appname=third-party-demo&callback=${uri}?action=${
        config.constants.urls.connectionDetails
      }&appid=${appid}`

    console.info('opening', urlize(config.appScheme))
    Linking.getInitialURL()
      .then(uri => {
        Linking.openURL(urlize(uri)).catch(error => {
          console.warn('error', error)

          Alert.alert('Notice', 'Behavior-based-notifications is not installed')
        })
      })
      .catch(err => {
        console.warn('Linking error', err)
      })
  },

  /** TODO - revise this to APN */
  requestConnectionDetails () {
    let urlize = (uri, auth) =>
      `bbn://connectionDetails?appname=third-party-demo&callback=${uri}?action=${
        config.constants.urls.connectionDetails
      }`

    console.info('opening', urlize('expo'))
    Linking.getInitialURL()
      .then(uri => {
        Linking.openURL(urlize(uri)).catch(error => {
          console.warn('error', error)

          Alert.alert('Notice', 'Behavior-based-notifications is not installed')
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
