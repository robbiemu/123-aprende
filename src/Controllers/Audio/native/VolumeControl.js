// modified for use with react-native from: https://github.com/kosmetism/react-soundplayer/blob/master/src/components/VolumeControl.js
import React, { Component } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import Slider from 'react-native-slider'
import PropTypes from 'prop-types'
import SoundCloudAudio from './soundcloud-audio'
import ClassNames from 'classnames'
import { VolumeIconLoudSVG, VolumeIconMuteSVG } from './icons'

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

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.volume)) {
      soundCloudAudio.audio.volume = xPos
      soundCloudAudio.audio.muted = mute
    }

    if (mute !== isMuted) {
      onToggleMute && onToggleMute.call(this, mute, { target: { value } })
    }

    onVolumeChange && onVolumeChange.call(this, xPos, { target: { value } })
  }

  handleMute (value) {
    const { onToggleMute, soundCloudAudio } = this.props
    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.muted)) {
      soundCloudAudio.audio.muted = !soundCloudAudio.audio.muted
    }

    onToggleMute &&
      onToggleMute.call(this, !this.props.isMuted, { target: { value } })
  }

  render () {
    const {
      className,
      buttonClassName,
      rangeClassName,
      volume,
      isMuted
    } = this.props

    let value = volume * 100 || 0

    if (value < 0 || isMuted) {
      value = 0
    }

    if (value > 100) {
      value = 100
    }

    const classNames = ClassNames('sb-soundplayer-volume', className)
    const buttonClassNames = ClassNames(
      'sb-soundplayer-btn sb-soundplayer-volume-btn',
      buttonClassName
    )
    const rangeClassNames = ClassNames(
      'sb-soundplayer-volume-range',
      rangeClassName
    )

    return (
      <View className={classNames}>
        <Button
          className={buttonClassNames}
          onClick={this.handleMute.bind(this)}>
          {isMuted ? <VolumeIconMuteSVG /> : <VolumeIconLoudSVG />}
        </Button>
        <View>
          <Slider
            className={rangeClassNames}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={value}
            onValueChange={this.handleVolumeChange.bind(this)}
          />
        </View>
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
