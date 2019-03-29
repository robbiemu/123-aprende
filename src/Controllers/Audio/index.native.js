import React from 'react'
import { View } from 'react-native'
import { Headline } from 'react-native-paper'
import PropTypes from 'prop-types'

import config from '@src/config/soundcloud'

// from https://github.com/robbiemu/react-soundplayer
// from src: https://github.com/kosmetism/react-soundplayer/blob/master/examples/players/ProgressSoundPlayer.js
import SoundCloud from './SoundCloud'
import {
  PlayButton,
  Progress,
  VolumeControl
} from 'react-soundplayer/components'

class Player extends React.Component {
  render () {
    const { track, currentTime, duration } = this.props

    return (
      <SoundCloud>
        <View className='p2 border navy mt1 mb3 flex flex-center rounded'>
          <PlayButton
            className='flex-none h4 mr2 button white btn-big button-outline button-grow bg-orange circle'
            {...this.props}
          />
          <View className='flex-auto'>
            <Headline className='h4 nowrap m0'>
              {track ? track.user.username : ''}
            </Headline>
            <Headline className='h4 nowrap caps m0'>
              {track ? track.title : ''}
            </Headline>
            <View className='flex flex-center'>
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
            </View>
          </View>
        </View>
      </SoundCloud>
    )
  }
}

Player.propTypes = {
  resolveUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
}

class Audio extends React.Component {
  render () {
    return <Player clientId={config.apiKey} resolveUrl={this.props.data.url} />
  }
}

export default Audio
