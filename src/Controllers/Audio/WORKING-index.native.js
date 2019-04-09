import React from 'react'
import { View, WebView } from 'react-native' // react-native-youtube is abandonoed with no updates in 1 year and the developer's site down for 6 months - project does not build their own example any more -- real shame, it looked top notch

class Audio extends React.Component {
  render () {
    const uri = `https://w.soundcloud.com/player/?url=${
      this.props.data.url
    }&amp;buying=false&amp;signle_active`

    const html = `<iframe width="100%" height="50%" src="${uri}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>`

    return (
      <View style={{ height: 67, overflowY: 'hidden' }}>
        <WebView
          style={{
            flex: 1,
            width: 350,
            height: 266,
            backgroundColor: 'green'
          }}
          javaScriptEnabled
          source={{ html }}
        />
      </View>
    )
  }
}

export default Audio
