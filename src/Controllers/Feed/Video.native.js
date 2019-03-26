import React from 'react'
import YouTube from 'react-native-youtube'

class Video extends React.Component {
  render () {
    return <YouTube
      videoId={this.props.data.id.videoId} 
      fullscreen={true}
      loop={false}

      style={{ alignSelf: 'stretch', height: 300 }}
    />
  }
}

export default Video
