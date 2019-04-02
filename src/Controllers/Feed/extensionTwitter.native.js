import config from '@src/config/app'
import TwitterService, { getBearerToken } from '@src/lib/twitter'
import { exists } from '@src/lib/utils'
// import { streamURL } from '@src/lib/twitter/react-native-simple-twitter/client'
import twitterConfig from '@src/config/twitter'

export async function getTwitterFeed (feed) {
  const bearer_credentials =
    encodeURI(twitterConfig.consumer_key) +
    ':' +
    encodeURI(twitterConfig.consumer_key_secret)
  let token = await getBearerToken(bearer_credentials)

  const query = config.appTags.concat(feed).join(' ')
  const q = query

  /* console.log('getting', TwitterService.endpoints.search_fullarchive)
  let results = await TwitterService.twitter
    .api(
      'post',
      TwitterService.endpoints.search_fullarchive,
      { query },
      undefined,
      'Bearer ' + token
    )
    .then(response => {
      // console.log('-------------twitter says', response)
      return []
    })
    .catch(e => {
      console.warn('error getting tweets', e)
      return []
    })

  return results
} */

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

        twitter.tweets = response.statuses.filter(tweet => {
          if (!tweet.entities || !tweet.entities.urls) return true
          return tweet.entities.urls.every(
            url => !isYoutubeVideo(url.expanded_url)
          )
        })
      } catch (e) {
        console.warn(e)
        return { video: [], tweets: [] }
      }

      console.log('-------------twitter says', response)
      console.log(twitter)

      return twitter
    })
    .catch(e => {
      console.warn('error getting tweets', e)
      return []
    })

  return results
}

const regexen = [
  /^(?:https?\:)?(?:\/\/)?youtu.be\/(\S+)/,
  /^(?:https?\:)?(?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
]

function isYoutubeVideo (url) {
  return regexen.some(regex => regex.test(url))
}

function getVideoKey (url) {
  // MDN's description of 'match' doesn't describe the JS interpreter in ios, so we can't just do string.match(r)
  return regexen
    .map(regex => {
      const res = regex.exec(url)
      return res ? res[0] : null
    })
    .filter(exists)
}
