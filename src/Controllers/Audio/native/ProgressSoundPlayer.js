// from src: https://github.com/kosmetism/react-soundplayer/blob/master/examples/players/ProgressSoundPlayer.js
import React, { Component } from 'react'
import { View } from 'react-native'
import { Headline } from 'react-native-paper'
import withSoundCloudAudio from './withSoundCloudAudio'
import PropTypes from 'prop-types'

import VolumeControl from './VolumeControl'
import PlayButton from './Playbutton'
import Progress from './Progress'
import {
  playButtonStyle,
  volumeButtonStyle,
  artistTitleStyle,
  playerStyle,
  bodyContainerStyle,
  rangeStyle
} from '@src/styles/components/audio'

class ProgressSoundPlayer extends Component {
  render () {
    const { track, currentTime, duration } = this.props

    return (
      <View style={playerStyle}>
        <PlayButton style={playButtonStyle} {...this.props} />
        <View style={bodyContainerStyle}>
          <Headline style={artistTitleStyle}>
            {track ? track.user.username : ''}
          </Headline>
          <Headline style={{ textTransform: 'uppercase', ...artistTitleStyle }}>
            {track ? track.title : ''}
          </Headline>
          <View>
            <VolumeControl
              {...Object.assign(
                { buttonStyle: volumeButtonStyle, rangeStyle },
                this.props
              )}
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
