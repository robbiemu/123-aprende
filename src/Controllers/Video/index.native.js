import React from 'react'
import YouTube from 'react-native-youtube'

import { videoStyle } from '@src/styles/components/video'
class Video extends React.Component {
  render () {
    return <YouTube
      videoId={this.props.data.id.videoId} 
      fullscreen={true}
      loop={false}

      style={video}
    />
  }
}

export default Video
