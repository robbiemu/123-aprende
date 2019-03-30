// from src: https://github.com/kosmetism/react-soundplayer/blob/master/examples/players/ProgressSoundPlayer.js
import React, { Component } from 'react'
import { View } from 'react-native'
import { Headline } from 'react-native-paper'
import withSoundCloudAudio from './withSoundCloudAudio'
import PropTypes from 'prop-types'

import VolumeControl from './VolumeControl'
import PlayButton from './Playbutton'
import Progress from './Progress'

class ProgressSoundPlayer extends Component {
  render () {
    const { track, currentTime, duration } = this.props

    return (
      <View>
        <PlayButton {...this.props} />
        <View>
          <Headline>{track ? track.user.username : ''}</Headline>
          <Headline>{track ? track.title : ''}</Headline>
          <View>
            <VolumeControl
              buttonClassName='flex-none h6 button white btn-small button-outline button-grow bg-orange circle btn-square'
              {...this.props}
            />
            <Progress
              innerClassName='rounded-left'
              value={(currentTime / duration) * 100 || 0}
              {...this.props}
            />
          </View>
        </View>
      </View>
    )
  }
}

ProgressSoundPlayer.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
}

export default withSoundCloudAudio(ProgressSoundPlayer)
