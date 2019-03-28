import React from 'react'
import YouTube from 'react-youtube'

import { videoStyle } from '@src/styles/components/video'

class Video extends React.Component {
  render () {
    return <YouTube
      videoId={this.props.data.id} 
      opts={{playerVars: {hl:'es', cc_load_policy: 1, cc_lang_pref: 'es'}}}

      style={videoStyle}
    />
  }
}

export default Video
