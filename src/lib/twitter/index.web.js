import axios from 'axios'

import config from '@src/config/twitter'

const bearer_credentials =
  config.consumer_key + ':' + config.consumer_key_secret

const twitter = {
  get,
  getBearerToken,
  getApplicationOnly
}

async function get (uri, payload) {
  const bearer_token = getBearerToken(bearer_credentials)

  const jsonObj = getApplicationOnly(uri, payload, bearer_token)
  return jsonObj
}

async function getBearerToken (bearer_credentials) {
  const headers = {}
  const base64_bc = btoa(bearer_credentials)
  headers.Authorization = 'Bearer ' + base64_bc
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

  let bodyFormData = new FormData()
  bodyFormData.set('grant_type', 'client_credentials')

  try {
    const bearer_token = await axios
      .post('https://api.twitter.com/oauth2/token', bodyFormData, { headers })
      .then(({ data }) => /* data.token_type === 'bearer' */ data.access_token)

    return bearer_token
  } catch (e) {
    console.error('error', e)
  }
}

async function getApplicationOnly (endpoint, payload, token) {
  const headers = {
    Authoorization: 'Bearer ' + token
  }

  try {
    const data = axios
      .get(endpoint, payload, { headers })
      .then(({ data }) => data)

    return data
  } catch (e) {
    console.error(e)
  }
}

export default {
  twitter,
  endpoints: config.endpoints
}
