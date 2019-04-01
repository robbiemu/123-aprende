import secret from './private'

export default {
  consumer_key: secret.twitter.API_key,
  consumer_key_secret: secret.twitter.API_secret_key,
  access_token: secret.twitter.access_token,
  access_token_secret: secret.twitter.access_token_secret,
  streamURL: 'stream.twitter.com',
  endpoints: {
    standard_search: 'search/tweets.json',
    search_30day:
      'tweets/search/30day/' + secret.twitter.environments['30day'] + '.json',
    search_fullarchive:
      'tweets/search/fullarchive/' +
      secret.twitter.environments.fullarchive +
      '.json',
    statuses_filter: 'statuses/filter.json'
  }
}
