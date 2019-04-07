import React from 'react'
import { Text } from 'react-native-paper'
import {
  getUniqueID,
  openUrl /* , renderRules */
} from 'react-native-markdown-renderer'

import config from '@src/config/app'
import history from '@src/lib/history'

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

function renderTweetLink (destination, children) {
  const tags = destination.replace(/^(tweet):\/\//, '')

  const tweet =
    'https://twitter.com/intent/tweet?hastags=' +
    [tags, ...config.appTags].join(',')

  return (
    <Text key={getUniqueID()} mode='text' onPress={() => openUrl(tweet)}>
      [{children}]
    </Text>
  )
}

export const rules = {
  link: (node, children, parent, styles) => {
    let destination = node && node.attributes ? node.attributes.href : undefined
    if (destination) {
      if (/^(?:local|vocabulary):\/\//.test(destination)) {
        return renderLocal(destination, children)
      }
      if (/^(?:tweet):\/\//.test(destination)) {
        return renderTweetLink(destination, children)
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
  }
}
