import React from 'react'
import { WebView } from 'react-native' // react-native-youtube is abandonoed with no updates in 1 year and the developer's site down for 6 months - project does not build their own example any more -- real shame, it looked top notch

import { videoStyle } from '@src/styles/components/video'

class Video extends React.Component {
  render () {
    console.log('rendering video with data', this.props)
    const uri = `https://www.youtube.com/embed/${
      this.props.data.id
    }?rel=0&autoplay=${
      this.props.data.hasOwnProperty('autoplay') ? this.props.data.autoplay : 0
    }&showinfo=0&hl=es&cc_lang_pref=es&cc_load_policy=${
      this.props.data.hasOwnProperty('cc_load_policy')
        ? this.props.data.cc_load_policy
        : 0
    }&playsinline=${
      this.props.data.hasOwnProperty('playsinline')
        ? this.props.data.playsinline
        : 0
    }&controls=1`

    return <WebView style={videoStyle} javaScriptEnabled source={{ uri }} />
  }
}

export default Video
