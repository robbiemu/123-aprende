import axios from 'axios'

import youtubeConfig from '@src/config/youtube'

export default class Youtube {
  static params = {
    key: youtubeConfig.apiKey
  }
  static requestParams = {
    maxResults: 25,
    part: 'snippet',
    safeSearch: 'strict',
    type: 'video'
  }

  static async request(p, id) {
    const params = Object.assign(
      {relatedToVideoId:1, id}, 
      Youtube.params, 
      Youtube.requestParams, 
      p)
    return axios.get(youtubeConfig.apiRequest.uri, {params})
  }
}
