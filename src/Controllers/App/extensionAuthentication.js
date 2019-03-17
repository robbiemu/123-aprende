import AsyncStorage from '@callstack/async-storage'
import { relayAuthToGraphcool as authToGraphcool } from '@src/lib/Graphcool'
import Firebase from '@src/lib/Firebase'
import history from '@src/lib/history'
import config from '@src/config/app'
import console from '@src/lib/console'

console.setPreface('src/App.authentication.js')

/** conditionallyAuthenticate - entry point to auth0 authentication in
 * authentication cycle. we manage the state 'isLoaded' from here.
 *
 * if we are not authenticated already, we let the auth0 component redirect the
 * user to sign in with auth0 (if this hasn't already happened).
 *
 * Auth0 returns the user with a callback, and the view will reMount.
 * If that is the case, authentication is we set the Splash component message
 * to notify the user, and let the auth0 component handle the authentication
 * callback.
 */
export async function conditionallyAuthenticate () {
  let authenticated = await this.state.auth0.isAuthenticated()
  if (!authenticated) {
    this.setState({ isLoaded: false })

    console.trace('not authenticated')

    await AsyncStorage.clear()

    if (!/access_token|id_token|error/.test(history.location.hash)) {
      console.trace('authentication pending')

      await this.state.auth0.login()
    } else {
      console.trace(
        `handling auth0 callback for location hash ${history.location.hash}`
      )

      this.setState({
        splashMessage: config.constants.messages.AUTHENTICATING,
        isLoaded: true
      })

      await this.state.auth0.handleAuthentication()
    }
  } else {
    console.trace('authenticated', authenticated)

    this.setState({ isLoaded: true })
  }
}

/** relayAuthToGraphcool - after auth0 authentication, ask Graphcool lib to login with auth0 credentials
 * after success, we redirect to Home component
 * after failure TODO
 */
export async function relayAuthToGraphcool () {
  await this.setState({
    isLoaded: await authToGraphcool({ auth0: this.state.auth0 })
  })

  if (this.state.isLoaded) {
    console.log('progressing home')
    history.replace('/home')
  } else {
    console.log(
      'checked isLoaded after relay to graphcool and found it is false'
    )
  }
}

/** helper function for render */
export async function isAuthenticated () {
  return this.state.auth0 && this.state.auth0.isAuthenticated()
}

/** logout - on user logout, clear the cache, reset the page to the inital page, and trigger the authentication cycle */
export async function logout () {
  console.log('App logout')
  await this.setState({ isLoaded: false })

  await this.state.apolloClient.resetStore()

  await Firebase.signout()

  if (this.state.auth0) await this.state.auth0.logout()

  await history.replace('/')

  // await AsyncStorage.clear()

  // console.trace('remaining async storage keys')
  // AsyncStorage.getAllKeys()
  //     .then(keys => AsyncStorage.multiGet(keys)
  //         .then(result => result.map(req => req).forEach(console.log))
  //     )

  await this.conditionallyAuthenticate()
  await this.relayAuthToGraphcool()
}