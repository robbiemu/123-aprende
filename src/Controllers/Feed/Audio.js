import React from 'react'
import { View, Platform } from 'react-native'

import config from '@src/config/app'
import YoutubeService from '@src/lib/Youtube'

class Audio extends React.Component {
  render () {
    return <View />
  }
}

export async function getAudioFeed() {
  const q = [config.appName].concat(this.getCohort()).concat(this.props.q)

  return YoutubeService.request({q}).then(({items}) => items).catch(e => {
    console.warn('error getting youtube videos', e)
    return []
  })
}

export default Audio