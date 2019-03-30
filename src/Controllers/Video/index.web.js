import React from 'react'
import YouTube from 'react-youtube'

import { videoStyle } from '@src/styles/components/video'

class Video extends React.Component {
  render () {
    return (
      <YouTube
        videoId={this.props.data.id}
        opts={{
          playerVars: {
            hl: 'es',
            cc_lang_pref: 'es',
            cc_load_policy: this.props.data.hasOwnProperty('cc_load_policy')
              ? this.props.data.cc_load_policy
              : 0,
            playsinline: this.props.data.hasOwnProperty('playsinline')
              ? this.props.data.playsinline
              : 0,
            autoplay: this.props.data.hasOwnProperty('autoplay')
              ? this.props.data.autoplay
              : 0
          }
        }}
        style={videoStyle}
      />
    )
  }
}

export default Video
