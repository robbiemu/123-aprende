import React from 'react'
import { View } from 'react-native'
import uuid from 'uuid/v4'

import config from '@src/config/app'
import { getTwitterFeed } from './extensionTwitter'
import { getVideoFeed } from './extensionVideo'
import { getAudioFeed } from './extensionAudio'
import { default as Video } from '@src/Controllers/Video'
import { default as Audio } from '@src/Controllers/Audio'

class Feed extends React.Component {
  state = {
    feed: null
  }

  async componentDidMount () {
    let feed = null
    switch (this.props.type) {
      case config.constants.activities.types.VideoSubmission:
        {
          switch (this.props.search) {
            case 'video':
              const results = await getVideoFeed(this.props.data)
              feed = results.map(video => <Video key={uuid()} data={video} />)
              break
            case 'twitter':
              const twitter = await getTwitterFeed(this.props.data)
              feed = twitter.video.map(video => (
                <Video key={uuid()} data={video} />
              )) /* -- someday: .concat(twitter.tweets.map(status => {
                <Tweet id= />
              })) */
              break
            default:
              console.warn('unknown video submission search', this.props.search)
          }
        }
        break
      case config.constants.activities.types.AudioSubmission:
        {
          const results = await getAudioFeed(this.props.data)
          feed = results.map(audio => <Audio key={uuid()} data={audio} />)
        }
        break
      default:
        console.warn('no such submission type ', this.props.type)
    }

    this.setState({ feed })
  }

  render () {
    return <View>{this.state.feed}</View>
  }
}

export default Feed
