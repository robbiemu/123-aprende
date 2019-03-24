import React from 'react'
import { Text } from 'react-native-paper'
import { getUniqueID, openUrl } from 'react-native-markdown-renderer'

import history from '@src/lib/history'

export let rules = {
  link: (node, children, parent, styles) => {
    let destination = (node && node.attributes) ? node.attributes.href: undefined
    if(destination) {
      if(/^(?:local|vocabulary):\/\//.test(destination)) {
        destination = destination.replace(/^(local|vocabulary):\/\//, '/')

        return <Text key={ getUniqueID() } mode="text" onPress={() => history.push(destination)}>
          [{ children }]
        </Text>
      } else {
        // this is the original link renderer for markdown: https://github.com/mientjan/react-native-markdown-renderer/blob/master/src/lib/renderRules.js
        return <Text key={ getUniqueID() } style={styles.link} onPress={() => openUrl(node.attributes.href)}>
          {children}
        </Text>
      }
    } else {
      return <Text key={ getUniqueID() } mode="text">
        { children }
      </Text>
    }
  }
}
