/** The purpose of lib/Auth is to handle authentication with identity authorities. In this case, we are using Auth0. The only complexity comes in how we handle the successful validation of identity: on any platform we prefer to use BBN data already associated with the backend account, but on iOS if it is not present we can query for it directly with openURL pattern. */

import auth0 from 'auth0-js'

import config from '@src/config/auth0'
import BaseAuth from './BaseAuth'

export default class Auth extends BaseAuth {
  auth0 = new auth0.WebAuth(config.web.connect)

  login () {
    this.auth0.authorize()
  }

  async handleAuthentication () {
    let authPromise = new Promise((resolve, rej) => {
      this.auth0.parseHash(async (err, authResult) => {
        resolve(this.handleAuthResult({ authResult, err }))
      })
    })

    return (() => authPromise)()
  }
}
