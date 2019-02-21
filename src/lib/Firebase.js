import firebase from 'firebase'
import 'firebase/firestore'
import AsyncStorage from '@callstack/async-storage'
import jwtDecode from 'jwt-decode'

import config from '@src/config/firebase'
import { getFirebaseToken } from '@src/lib/Graphcool'

/** the purpose of this library is to provide tx to the firebase backend.
 * notes:
 *  - the expiration date in firebase is not in milliseconds (like it is with Auth0), but rather whole seconds!
 */

// Initialize Firebase
firebase.initializeApp(config)

const isValidToken = token => {
  try {
    const decoded = jwtDecode(token, { complete: true })
    if (!decoded) {
      console.warn('did not return a decoded jwt')
      return false
    }

    return new Date().getTime() / 1000 < +decoded.exp
  } catch (err) {
    console.warn('error', err)
    return false
  }
}

export default {
  firebase,
  async getDb () {
    let token = await AsyncStorage.getItem('firebase_token')
    if (!isValidToken(token)) {
      await getFirebaseToken()
      token = await AsyncStorage.getItem('firebase_token')

      if (!isValidToken(token)) {
        return console.error('could not get valid token')
      }
    }

    console.trace('signing into firebase with token', token)

    await firebase
      .auth()
      .signInWithCustomToken(token)
      .catch(err => {
        console.error('error', err)
      })

    // Initialize Cloud Firestore through Firebase
    return firebase.firestore() // db
  },

  async signout () {
    return firebase
      .auth()
      .signOut()
      .then(() => true)
      .catch(err => {
        console.warn('error singing out', err)
        return false
      })
  }
}
