import config from '@src/config/app'
import TwitterService, { getBearerToken } from '@src/lib/twitter'
import { exists } from '@src/lib/utils'
// import { streamURL } from '@src/lib/twitter/react-native-simple-twitter/client'
import twitterConfig from '@src/config/twitter'

export async function getTwitterFeed (feed) {
  const hashless = feed.map(term => (/^\#/.test(term) ? term.substr(1) : term))

  const query = hashless
    .concat(config.appTags)
    // .map(term => '#' + term)
    .join(' ')

  console.log(query)
  const q = query

  console.log('getting', TwitterService.endpoints.search_30day)
  const bearer_credentials =
    encodeURI(twitterConfig.consumer_key) +
    ':' +
    encodeURI(twitterConfig.consumer_key_secret)

  let token = await getBearerToken(bearer_credentials)

  let results = await TwitterService.twitter
    .api(
      'post',
      TwitterService.endpoints.search_30day,
      { query },
      undefined,
      'Bearer ' + token
    )
    .then(response => {
      try {
        twitter = {}
        twitter.video = response.results
          .map(tweet => {
            if (!tweet.entities || !tweet.entities.urls) return []
            return tweet.entities.urls
              .filter(url => isYoutubeVideo(url.expanded_url))
              .map(url => ({ id: getVideoKey(url.expanded_url) }))
          })
          .flat(2)

        twitter.audio = response.results
          .map(tweet => {
            if (!tweet.entities || !tweet.entities.urls) return []
            return tweet.entities.urls
              .filter(url => isSoundcloudAudio(url.expanded_url))
              .map(url => ({ url: url.expanded_url }))
          })
          .flat(2)

        twitter.tweets = response.results.filter(tweet => {
          if (!tweet.entities || !tweet.entities.urls) return true
          return tweet.entities.urls.every(
            url =>
              !isYoutubeVideo(url.expanded_url) &&
              !isSoundcloudAudio(url.expanded_url)
          )
        })
      } catch (e) {
        console.warn(e)
        return { video: [], audio: [], tweets: [] }
      }

      console.log('-------------twitter says', response)
      console.log(twitter)

      return twitter
    })
    /*
  console.log('getting', TwitterService.endpoints.standard_search)
  let results = await TwitterService.twitter
    .get(TwitterService.endpoints.standard_search, { q })
    .then(response => {
      try {
        twitter = {}
        twitter.video = response.statuses
          .map(tweet => {
            if (!tweet.entities || !tweet.entities.urls) return []
            return tweet.entities.urls
              .filter(url => isYoutubeVideo(url.expanded_url))
              .map(url => ({ id: getVideoKey(url.expanded_url) }))
          })
          .flat(2)

        twitter.audio = response.statuses
          .map(tweet => {
            if (!tweet.entities || !tweet.entities.urls) return []
            return tweet.entities.urls
              .filter(url => isSoundcloudAudio(url.expanded_url))
              .map(url => ({ id: getAudioKey(url.expanded_url) }))
          })
          .flat(2)

        twitter.tweets = response.statuses.filter(tweet => {
          if (!tweet.entities || !tweet.entities.urls) return true
          return tweet.entities.urls.every(
            url => !isYoutubeVideo(url.expanded_url)
          )
        })
      } catch (e) {
        console.warn(e)
        return { video: [], audio: [], tweets: [] }
      }

      console.log('-------------twitter says', response)
      console.log(twitter)

      return twitter
    })
  */
    .catch(e => {
      console.warn('error getting tweets', e)
      return { video: [], audio: [], tweets: [] }
    })

  return results
}

const regexen = {
  youtube: [
    /^(?:https?\:)?(?:\/\/)?youtu.be\/(\S+)/,
    /^(?:https?\:)?(?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
  ],
  soundcloud: [
    /^(?:https?\:)?(?:\/\/)?(?:www\.)?soundcloud\.com\/([^/]+\/[^/&?]+)/
  ]
}

function isYoutubeVideo (url) {
  return regexen.youtube.some(regex => regex.test(url))
}

function isSoundcloudAudio (url) {
  return regexen.soundcloud.some(regex => regex.test(url))
}

function getVideoKey (url) {
  // MDN's description of 'match' doesn't describe the JS interpreter in ios, so we can't just do string.match(r)
  return regexen.youtube
    .map(regex => {
      const res = regex.exec(url)
      return res ? res[0] : null
    })
    .filter(exists)
}
