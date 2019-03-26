import config from '@src/config/app'
import YoutubeService from '@src/lib/Youtube'
import { getCohort } from '@src/lib/utils'

export async function getVideoFeed(feed) {
  const q = [config.appName].concat(getCohort()).concat(feed.q).join(' ')

  let results = await YoutubeService.request({q}, feed.relatedToVideoId).then(({data}) => data.items).catch(e => {
    console.warn('error getting youtube videos', e)
    return []
  })

  return results
}
