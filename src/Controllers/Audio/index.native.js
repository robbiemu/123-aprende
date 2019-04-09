import React from 'react'

import config from '@src/config/soundcloud'
import ProgressSoundPlayer from './native/ProgressSoundPlayer'

class Audio extends React.Component {
  render () {
    return (
      <ProgressSoundPlayer
        clientId={config.apiKey}
        resolveUrl={this.props.data.url}
      />
    )
  }
}

export default Audio
