// from src: https://github.com/kosmetism/react-soundplayer/blob/master/examples/players/ProgressSoundPlayer.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withSoundCloudAudio } from 'react-soundplayer/addons'
import { PlayButton, Progress } from 'react-soundplayer/components'
import VolumeControl from './VolumeControl'
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
      <div style={playerStyle}>
        <PlayButton style={playButtonStyle} {...this.props} />
        <div style={bodyContainerStyle}>
          <h2 style={artistTitleStyle}>{track ? track.user.username : ''}</h2>
          <h2
            style={Object.assign(
              { textTransform: 'uppercase' },
              artistTitleStyle
            )}>
            {track ? track.title : ''}
          </h2>
          <div className='flex flex-center'>
            <VolumeControl
              {...Object.assign(
                { buttonStyle: volumeButtonStyle, rangeStyle },
                this.props
              )}
            />
            <Progress
              className='mt1 mb1 rounded'
              innerClassName='rounded-left'
              value={(currentTime / duration) * 100 || 0}
              {...this.props}
            />
          </div>
        </div>
      </div>
    )
  }
}

ProgressSoundPlayer.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
}

export default withSoundCloudAudio(ProgressSoundPlayer)
