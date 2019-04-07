import React from 'react'
import { View } from 'react-native'
import { Text, Subheading } from 'react-native-paper'
import {
  getUniqueID,
  styles,
  openUrl /* , renderRules */
} from 'react-native-markdown-renderer'
import FitImage from 'react-native-fit-image'

import config from '@src/config/app'
import Video from '@src/Controllers/Video'
import Audio from '@src/Controllers/Audio'

function renderYoutube (destination, children) {
  destination = destination.replace(/^(youtube):\/\//, '')

  return (
    <View key={getUniqueID()} style={{ justifyContent: 'center' }}>
      <Video data={{ id: destination }} />
      <Subheading mode='text'>{children}</Subheading>
    </View>
  )
}

function renderSoundcloud (destination, children) {
  destination = destination.replace(/^(soundcloud):\/\//, '')

  return (
    <View key={getUniqueID()}>
      <Audio
        data={{
          url:
            config.constants.activities.AudioSubmission.soundcloud_base_uri +
            destination
        }}
      />
      <Text
        style={styles.link}
        onPress={() => openUrl(children[0].props.children)}>
        {config.constants.activities.OPEN_ON_SOUNDCLOUD}
      </Text>
    </View>
  )
}

export const rules = {
  image: (node, children, parent, styles) => {
    // console.log('I`m in UR image, lookin at yer', node)
    let destination = node && node.attributes ? node.attributes.src : undefined
    if (/^(?:youtube):\/\//.test(destination)) {
      return renderYoutube(destination, children)
    } else if (/^(?:soundcloud):\/\//.test(destination)) {
      return renderSoundcloud(destination, children)
    } else {
      return (
        <FitImage
          indicator
          key={node.key}
          style={styles.image}
          source={{ uri: node.attributes.src }}
        />
      )
    }
  }
}
