import AsyncStorage from '@callstack/async-storage'
import { getRawClient } from './index'
import { default as appConfig } from '@src/config/app'
import User from '@src/Models/User'

export const getFirebaseToken = async () => {
  console.trace('getFirebaseToken')

  const userIdentifier = await AsyncStorage.getItem(
    appConfig.constants.bbn.connectionDetails.uid
  )
  if (!userIdentifier) {
    throw new Error(
      'userIdentifier not in cache before call to getFirebaseToken'
    )
  }

  let apolloClient = await getRawClient()

  await apolloClient
    .query({ query: User.self, forceFetch: true })
    .then(async initial => {
      if (!initial.data.user) {
        // we didn't sign in?
        console.error('error using connected data')
      } else {
        console.trace('attempting to getFirebaseToken with uid', userIdentifier)
        await apolloClient
          .query({
            query: User.getFirebaseToken,
            variables: { userIdentifier }
          })
          .then(async response => {
            console.trace('received firebase token response', response)

            await AsyncStorage.setItem(
              'firebase_token',
              response.data.getFirebaseToken.token
            )
          })
          .catch(err => console.error('error getting token', err))
      }
    })
    .catch(err => console.error('error verifying self', err))
}
