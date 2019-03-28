import React from 'react'
import PropTypes from 'prop-types'

import config from '@src/config/app'
import YoutubeService from '@src/lib/Youtube'

// from https://github.com/robbiemu/react-soundplayer
// from src: https://github.com/kosmetism/react-soundplayer/blob/master/examples/players/ProgressSoundPlayer.js
import { withSoundCloudAudio } from 'react-soundplayer/addons'
import {
  PlayButton,
  Progress,
  VolumeControl
} from 'react-soundplayer/components'

class Player extends React.Component {
  render () {
    const { track, currentTime, duration } = this.props

    return (
      <div className='p2 border navy mt1 mb3 flex flex-center rounded'>
        <PlayButton
          className='flex-none h4 mr2 button white btn-big button-outline button-grow bg-orange circle'
          {...this.props}
        />
        <div className='flex-auto'>
          <h2 className='h4 nowrap m0'>{track ? track.user.username : ''}</h2>
          <h2 className='h4 nowrap caps m0'>{track ? track.title : ''}</h2>
          <div className='flex flex-center'>
            <VolumeControl
              className='mr2 flex flex-center'
              buttonClassName='flex-none h6 button white btn-small button-outline button-grow bg-orange circle btn-square'
              {...this.props}
            />
            <Progress
              className='mt1 mb1 rounded'
              innerClassName='rounded-left'
              value={(currentTime / duration) * 100 || 0}
              {...this.props}
            />
          </div>
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
}

const ProgressSoundPlayer = withSoundCloudAudio(ProgressSoundPlayer)

class Audio extends React.Component {
  render () {
    return <Player clientId={config} resolveUrl={this.props.data.url} />
  }
}

export default Audio
