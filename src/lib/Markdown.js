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
import history from '@src/lib/history'
import Video from '@src/Controllers/Video'
import Audio from '@src/Controllers/Audio'

export let rules = {
  link: (node, children, parent, styles) => {
    let destination = node && node.attributes ? node.attributes.href : undefined
    if (destination) {
      if (/^(?:local|vocabulary):\/\//.test(destination)) {
        return renderLocal(destination, children)
      }

      // this is the original link renderer for markdown: https://github.com/mientjan/react-native-markdown-renderer/blob/master/src/lib/renderRules.js
      return (
        <Text
          key={getUniqueID()}
          style={styles.link}
          onPress={() => openUrl(node.attributes.href)}>
          {children}
        </Text>
      )
    } else {
      return (
        <Text key={getUniqueID()} mode='text'>
          {children}
        </Text>
      )
    }
  },
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

function renderLocal (destination, children) {
  destination = destination.replace(/^(local|vocabulary):\/\//, '/')

  return (
    <Text
      key={getUniqueID()}
      mode='text'
      onPress={() => history.push(destination)}>
      [{children}]
    </Text>
  )
}

function renderYoutube (destination, children) {
  destination = destination.replace(/^(youtube):\/\//, '')
  return (
    <View key={getUniqueID()}>
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
