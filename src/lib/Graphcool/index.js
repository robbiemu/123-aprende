/** lib/Graphcool handles preparing transactions as necessary to render data in ApolloProvider in the app. This includes connection and authentication, as well as BBN data */

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { setContext } from 'apollo-link-context'
// import apolloLogger from 'apollo-link-logger'
import AsyncStorage from '@callstack/async-storage'

import config from '@src/config/graphcool'
import console from '@src/lib/console'

export { relayAuthToGraphcool } from './extensionAuth0'
export { relayBBNToGraphcool } from './extensionLinking'
export { getFirebaseToken } from './extensionFirebase'

console.setPreface('src/lib/Graphcool')

export var apolloClient
var _cache

// from src: https://github.com/kadikraman/offline-first-mobile-example/blob/master/app/src/config/getApolloClient.js
export const getApolloClient = async () => {
  apolloClient = await getRawClient({ savingCache: true })

  const cache = _cache

  try {
    await persistCache({
      cache,
      storage: AsyncStorage
    })
  } catch (err) {
    console.error('Error restoring Apollo cache', err) // eslint-disable-line no-console
  }

  return apolloClient
}

export const getRawClient = async ({ savingCache = false } = {}) => {
  const retryLink = new RetryLink({
    delay: {
      initial: 1000
    },
    attempts: {
      max: 1000,
      retryIf: (error, _operation) => {
        if (error.message === 'Network request failed') {
          // if (_operation.operationName === 'createPost')
          //    return true
        }
        return false
      }
    }
  })
  if (!retryLink) console.log('getting rid of eslint warning')

  // from: https://www.apollographql.com/docs/react/recipes/authentication.html
  const authLink = setContext(async (req, { headers }) => {
    // get the authentication token from local storage if it exists
    let getToken = async () =>
      await AsyncStorage.getItem(/* 'access_token' */ 'graphcool_token')
    const token = await getToken()

    // console.trace(' --- token for connection to graphcool is currently', token, req.operationName)

    // return the headers to the context so httpLink can read them
    return token
      ? {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : null
        }
      }
      : { headers }
  })

  const httpLink = new HttpLink(config)
  const link = ApolloLink.from([
    /* apolloLogger, */
    /* retryLink, */

    authLink,
    httpLink
  ])

  const cache = new InMemoryCache()
  if (savingCache) {
    _cache = cache
  }

  return new ApolloClient({
    link,
    cache
  })
}
