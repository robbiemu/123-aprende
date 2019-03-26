import React from 'react'
import { Platform } from 'react-native'
import YouTube from 'react-youtube'

class Video extends React.Component {
  render () {
    return <YouTube
      videoId={this.props.data.id} 
      opts={{playerVars: {hl:'es', cc_load_policy: 1, cc_lang_pref: 'es'}}}

      style={{ alignSelf: 'stretch', height: 300 }}
    />
  }
}

export default Video
