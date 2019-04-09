/* eslint no-lone-blocks: "error" */
/* eslint-env es6 */
import React from 'react'
import { Platform, View } from 'react-native'
import { Text } from 'react-native-paper'
import { openUrl } from 'react-native-markdown-renderer'

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
        switch (this.props.search) {
          case 'video':
            const results = await getVideoFeed(this.props.data)
            feed = results.map(video => <Video key={uuid()} data={video} />)
            break
          case 'twitter':
            const twitter = await getTwitterFeed(this.props.data)
            feed = twitter.video.map(video => (
              <Video key={uuid()} data={video} />
            ))
            if (Platform.OS === 'ios') {
            } else {
              const hashtags = config.appTags
                .map(tag => '#' + tag)
                .concat(this.props.data)
                .map(tag => encodeURIComponent(tag))

              const tweet = 'https://twitter.com/search?src=typd&q=' + hashtags

              feed.push(
                <Text key={uuid()} mode='text' onPress={() => openUrl(tweet)}>
                  [{this.props.data.join(' ')}]
                </Text>
              )
            }
            /* -- someday: .concat(twitter.tweets.map(status => {
                <Tweet id= />
              })) */
            break
          default:
            console.warn('unknown video submission search', this.props.search)
        }
        break
      case config.constants.activities.types.AudioSubmission:
        const results = await getAudioFeed(this.props.data)
        feed = results.map(audio => <Audio key={uuid()} data={audio} />)

        const twitter = await getTwitterFeed(this.props.data)
        feed = feed.concat(
          twitter.audio.map(audio => <Audio key={uuid()} data={audio} />)
        )
        if (Platform.OS === 'ios') {
        } else {
          const hashtags = config.appTags
            .map(tag => '#' + tag)
            .concat(this.props.data)
            .map(tag => encodeURIComponent(tag))

          const tweet = 'https://twitter.com/search?src=typd&q=' + hashtags

          feed.push(
            <Text key={uuid()} mode='text' onPress={() => openUrl(tweet)}>
              [{this.props.data.join(' ')}]
            </Text>
          )
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
