// modified for use with react-native from: https://github.com/kosmetism/react-soundplayer/blob/master/src/components/Progress.js
import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import SoundCloudAudio from './soundcloud-audio'
import ClassNames from 'classnames'

class Progress extends Component {
  handleSeekTrack (e) {
    const { onSeekTrack, soundCloudAudio } = this.props
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.duration)) {
      soundCloudAudio.audio.currentTime = xPos * soundCloudAudio.audio.duration
    }

    onSeekTrack && onSeekTrack.call(this, xPos, e)
  }

  render () {
    const {
      className,
      innerClassName,
      style,
      currentTime,
      duration
    } = this.props
    let { value, innerStyle } = this.props

    if (!value && currentTime && duration) {
      value = (currentTime / duration) * 100 || 0
    }

    if (value < 0) {
      value = 0
    }

    if (value > 100) {
      value = 100
    }

    const classNames = ClassNames(
      'sb-soundplayer-progress-container',
      className
    )
    const innerClassNames = ClassNames(
      'sb-soundplayer-progress-inner',
      innerClassName
    )

    if (!innerStyle) {
      innerStyle = {}
    }

    innerStyle = Object.assign({}, innerStyle, { width: `${value}%` })

    return (
      <View
        className={classNames}
        style={style}
        onClick={this.handleSeekTrack.bind(this)}>
        <View className={innerClassNames} style={innerStyle} />
      </View>
    )
  }
}

Progress.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  innerStyle: PropTypes.object,
  value: PropTypes.number,
  onSeekTrack: PropTypes.func,
  soundCloudAudio: PropTypes.instanceOf(SoundCloudAudio)
}

Progress.defaultProps = {
  value: 0
}

export default Progress
