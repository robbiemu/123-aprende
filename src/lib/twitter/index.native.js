import { Base64 } from 'js-base64'

import config from '@src/config/twitter'
import twitter from './react-native-simple-twitter'

twitter.setConsumerKey(config.consumer_key, config.consumer_key_secret)

export async function getBearerToken (bearer_credentials) {
  console.log(
    'attempting to authenticate app with credentials',
    bearer_credentials
  )
  const base64_bc = Base64.encode(bearer_credentials)
  const headers = {
    Accept: 'application/json',
    Authorization: 'Basic ' + base64_bc,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  let bodyFormData = 'grant_type=client_credentials'

  try {
    const bearer_token = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers,
      body: bodyFormData
    }).then(async response => (await response.json()).access_token)

    return bearer_token
  } catch (e) {
    console.error('error', e)
  }
}

export default {
  twitter,
  endpoints: config.endpoints
}
