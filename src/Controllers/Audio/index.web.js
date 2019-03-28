import React from 'react'
import ProgressSoundPlayer from '@src/lib/vendor/kosmetism/ProgressSoundPlayer'

class Audio extends React.Component {
  render () {
    return (
      <ProgressSoundPlayer
        clientId={this.props.data.config}
        resolveUrl={this.props.data.url}
      />
    )
  }
}

export default Audio
