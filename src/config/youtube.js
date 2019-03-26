import secret from './private'

export default {
  apiKey: secret.youtube.apiKey,
  apiRequest: {
    uri: 'https://www.googleapis.com/youtube/v3/videos'
  }
}