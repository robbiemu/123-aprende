import config from '@src/config/app'
import YoutubeService from '@src/lib/Youtube'

export async function getVideoFeed(feed) {
  const q = config.appTags.concat(feed.q).join(' ')

  let results = await YoutubeService.request({q}, feed.relatedToVideoId).then(({data}) => data.items).catch(e => {
    console.warn('error getting youtube videos', e)
    return []
  })

  return results
}
