// modified for use with react-native-web from: https://github.com/kosmetism/react-soundplayer/blob/master/src/components/VolumeControl.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SoundCloudAudio from 'soundcloud-audio'

// directly from src
// Volume
const VolumeIconSVG = props => (
  <svg
    className='sb-soundplayer-icon'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 75 75'
    fill='currentColor'
    stroke='currentColor'>
    {props.children}
  </svg>
)
const VolumeIconLoudSVG = () => (
  <VolumeIconSVG>
    <polygon
      points='39.389,13.769 22.235,28.606 6,28.606 6,47.699 21.989,47.699 39.389,62.75 39.389,13.769'
      style={{ strokeWidth: 5, strokeLinejoin: 'round' }}
    />
    <path
      d='M 48.128,49.03 C 50.057,45.934 51.19,42.291 51.19,38.377 C 51.19,34.399 50.026,30.703 48.043,27.577'
      style={{ fill: 'none', strokeWidth: 5, strokeLinecap: 'round' }}
    />
    <path
      d='M 55.082,20.537 C 58.777,25.523 60.966,31.694 60.966,38.377 C 60.966,44.998 58.815,51.115 55.178,56.076'
      style={{ fill: 'none', strokeWidth: 5, strokeLinecap: 'round' }}
    />
    <path
      d='M 61.71,62.611 C 66.977,55.945 70.128,47.531 70.128,38.378 C 70.128,29.161 66.936,20.696 61.609,14.01'
      style={{ fill: 'none', strokeWidth: 5, strokeLinecap: 'round' }}
    />
  </VolumeIconSVG>
)

const VolumeIconMuteSVG = () => (
  <VolumeIconSVG>
    <polygon
      points='39.389,13.769 22.235,28.606 6,28.606 6,47.699 21.989,47.699 39.389,62.75 39.389,13.769'
      style={{ stroke: '#11111', strokeWidth: 5, strokeLinejoin: 'round' }}
    />
    <path
      d='M 48.651772,50.269646 69.395223,25.971024'
      style={{ fill: 'none', strokeWidth: 5, strokeLinecap: 'round' }}
    />
    <path
      d='M 69.395223,50.269646 48.651772,25.971024'
      style={{ fill: 'none', strokeWidth: 5, strokeLinecap: 'round' }}
    />
  </VolumeIconSVG>
)

class VolumeControl extends Component {
  state = {
    isHoveringRange: false,
    isHoveringVolume: false
  }

  handleVolumeChange (e) {
    const {
      onVolumeChange,
      onToggleMute,
      soundCloudAudio,
      isMuted
    } = this.props
    const xPos = e.target.value / 100
    const mute = xPos <= 0 && !isMuted

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.volume)) {
      soundCloudAudio.audio.volume = xPos
      soundCloudAudio.audio.muted = mute
    }

    if (mute !== isMuted) {
      onToggleMute && onToggleMute.call(this, mute, e)
    }

    onVolumeChange && onVolumeChange.call(this, xPos, e)
  }

  handleMute (e) {
    const { onToggleMute, soundCloudAudio } = this.props

    if (soundCloudAudio && !isNaN(soundCloudAudio.audio.muted)) {
      soundCloudAudio.audio.muted = !soundCloudAudio.audio.muted
    }

    onToggleMute && onToggleMute.call(this, !this.props.isMuted, e)
  }

  render () {
    const {
      buttonContainerStyle,
      buttonStyle,
      rangeStyle,
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

    const toggleState = this.toggleState.bind(this)
    const containerStyle = Object.assign(
      { display: 'flex', flexDirection: 'row', flex: 1 },
      buttonContainerStyle
    )

    const isRangeShowing =
      this.state.isHoveringRange || this.state.isHoveringVolume

    return (
      <div style={containerStyle}>
        <button
          style={buttonStyle}
          onMouseEnter={() => toggleState('isHoveringVolume', true)}
          onMouseLeave={() => toggleState('isHoveringVolume', false)}
          onClick={this.handleMute.bind(this)}>
          {isMuted ? <VolumeIconMuteSVG /> : <VolumeIconLoudSVG />}
        </button>
        {isRangeShowing && (
          <div
            style={{
              minWidth: 330,
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              marginLeft: '-10px'
            }}>
            <input
              style={rangeStyle}
              onMouseEnter={() => toggleState('isHoveringRange', true)}
              onMouseLeave={() => toggleState('isHoveringRange', false)}
              type='range'
              min='0'
              max='100'
              step='1'
              value={value}
              onChange={this.handleVolumeChange.bind(this)}
            />
          </div>
        )}
      </div>
    )
  }

  toggleState (piece, state) {
    state = state === undefined ? !this.state[piece] : state

    this.setState({ [piece]: state })
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
