// modified for use with react-native from: https://github.com/kosmetism/react-soundplayer/blob/master/src/components/VolumeControl.js
import React, { Component } from 'react'
import { View } from 'react-native'
import Slider from 'react-native-slider'
import PropTypes from 'prop-types'
import SoundCloudAudio from './soundcloud-audio'
import ClassNames from 'classnames'

class VolumeControl extends Component {
  handleVolumeChange (value) {
    const {
      onVolumeChange,
      onToggleMute,
      soundCloudAudio,
      isMuted
    } = this.props
    const xPos = value / 100
    const mute = xPos <= 0 && !isMuted

    soundCloudAudio.audio.getStatusAsync().then(status => {
      soundCloudAudio.audio.setVolumeAsync(xPos).then(() => {
        onVolumeChange &&
          onVolumeChange.call(this, xPos, { target: { value: xPos } })

        if (status.isMuted !== mute) {
          soundCloudAudio.audio.setStatusAsync({ isMuted: mute })
        }

        if (mute !== isMuted) {
          onToggleMute && onToggleMute.call(this, mute, { target: { value } })
        }
      })
    })
  }

  handleMute (value) {
    const { onToggleMute, soundCloudAudio } = this.props
    soundCloudAudio.getStatusAsync().then(status => {
      soundCloudAudio.audio.setStatusAsync({ isMuted: !status.isMuted })

      onToggleMute &&
        onToggleMute.call(this, !this.props.isMuted, { target: { value } })
    })
  }

  render () {
    const { className, rangeStyle, volume, isMuted } = this.props

    let value = volume * 100 || 0

    if (value < 0 || isMuted) {
      value = 0
    }

    if (value > 100) {
      value = 100
    }

    const classNames = ClassNames('sb-soundplayer-volume', className)

    return (
      <View className={classNames}>
        <Slider
          style={rangeStyle}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={value}
          onValueChange={this.handleVolumeChange.bind(this)}
        />
      </View>
    )
  }
}

VolumeControl.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  rangeClassName: PropTypes.string,
  volume: PropTypes.number,
  onVolumeChange: PropTypes.func,
  onToggleMute: PropTypes.func,
  soundCloudAudio: PropTypes.instanceOf(SoundCloudAudio)
}

VolumeControl.defaultProps = {
  volume: 1,
  isMuted: 0
}

export default VolumeControl
