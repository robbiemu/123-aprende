// highly modified from official Auth0 documentation example: https://auth0.com/docs/quickstart/spa/react?framed=1&sq=1#configure-auth0

import AsyncStorage from '@callstack/async-storage'

export default class BaseAuth {
  async setSession (authResult) {
    console.log('authResult', authResult)

    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )

    await AsyncStorage.setItem('access_token', authResult.accessToken)
    await AsyncStorage.setItem('id_token', authResult.idToken)
    await AsyncStorage.setItem('expires_at', expiresAt)

    return true
  }

  async logout () {
    // Clear access token and ID token from local storage
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('id_token')
    await AsyncStorage.removeItem('expires_at')
  }

  /* Check whether the current time is past the access token's expiry time */
  async isAuthenticated () {
    const jsonDate = await AsyncStorage.getItem('expires_at')
    const expiresAt = JSON.parse(jsonDate)

    return new Date().getTime() < expiresAt
  }

  async handleAuthResult ({ authResult, err }) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      return this.setSession(authResult)
    } else if (err) {
      console.error('error', err)

      alert(`Error: ${err.error}. Check the console for further details.`)
      return false
    }
  }
}
