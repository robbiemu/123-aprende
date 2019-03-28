import React from 'react'
import { View } from 'react-native'
import { SoundCloudAudio } from 'soundcloud-audio'

export default class SoundCloud extends React.Component {
  constructor (props, context) {
    super(props, context)

    if (!props.clientId && !props.soundCloudAudio && !props.streamUrl) {
      console.warn(
        `You need to get a clientId from SoundCloud,
            pass in an instance of SoundCloudAudio
            or use streamUrl with audio source instead
            https://github.com/soundblogs/react-soundplayer#examples`
      )
    }

    // Don't create a SoundCloudAudio instance
    // if there is no `window`
    if (typeof window !== 'undefined') {
      if (props.soundCloudAudio) {
        this.soundCloudAudio = props.soundCloudAudio
      } else {
        this.soundCloudAudio = new SoundCloudAudio(props.clientId)
      }
    }

    this.state = {
      duration: 0,
      currentTime: 0,
      seeking: false,
      playing: false,
      volume: 1,
      isMuted: false
    }
  }

  componentDidMount () {
    this.mounted = true

    this.requestAudio()
    this.listenAudioEvents()
  }

  componentWillUnmount () {
    this.mounted = false

    resetPlayedStore()
    this.soundCloudAudio.unbindAll()
  }

  requestAudio () {
    const { soundCloudAudio } = this
    const { resolveUrl, streamUrl, preloadType, onReady } = this.props

    if (streamUrl) {
      soundCloudAudio.preload(streamUrl, preloadType)
    } else if (resolveUrl) {
      soundCloudAudio.resolve(resolveUrl, data => {
        if (!this.mounted) {
          return
        }

        this.setState(
          {
            [data.tracks ? 'playlist' : 'track']: data
          },
          () => onReady && onReady()
        )
      })
    }
  }

  listenAudioEvents () {
    const { soundCloudAudio } = this

    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    soundCloudAudio.on('playing', this.onAudioStarted.bind(this))
    soundCloudAudio.on('timeupdate', this.getCurrentTime.bind(this))
    soundCloudAudio.on('loadedmetadata', this.getDuration.bind(this))
    soundCloudAudio.on('seeking', this.onSeekingTrack.bind(this))
    soundCloudAudio.on('seeked', this.onSeekedTrack.bind(this))
    soundCloudAudio.on('pause', this.onAudioPaused.bind(this))
    soundCloudAudio.on('ended', this.onAudioEnded.bind(this))
    soundCloudAudio.on('volumechange', this.onVolumeChange.bind(this))
  }

  onSeekingTrack () {
    this.setState({ seeking: true })
  }

  onSeekedTrack () {
    this.setState({ seeking: false })
  }

  onAudioStarted () {
    const { soundCloudAudio } = this
    const { onStartTrack } = this.props

    this.setState({ playing: true })

    stopAllOther(soundCloudAudio.playing)
    addToPlayedStore(soundCloudAudio)

    onStartTrack && onStartTrack(soundCloudAudio, soundCloudAudio.playing)
  }

  onAudioPaused () {
    const { onPauseTrack } = this.props

    this.setState({ playing: false })

    onPauseTrack && onPauseTrack(this.soundCloudAudio)
  }

  onAudioEnded () {
    const { onStopTrack } = this.props

    this.setState({ playing: false })

    onStopTrack && onStopTrack(this.soundCloudAudio)
  }

  onVolumeChange () {
    this.setState({
      volume: this.soundCloudAudio.audio.volume,
      isMuted: this.soundCloudAudio.audio.muted
    })
  }

  getCurrentTime () {
    this.setState({
      currentTime: this.soundCloudAudio.audio.currentTime
    })
  }

  getDuration () {
    this.setState({
      duration: this.soundCloudAudio.audio.duration
    })
  }

  render () {
    return <View>{this.props.children}</View>
  }
}
