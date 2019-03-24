import React from 'react'
import { Text } from 'react-native-paper'
import {getUniqueID} from 'react-native-markdown-renderer'

import history from '@src/lib/history'

export let rules = {
  link: (node, children, parent, styles) => {
    let destination = (node && node.attributes) ? node.attributes.href: undefined
    if(destination) {
      destination = destination.replace(/^(local|vocabulary):\/\//, '/')

      return <Text key={ getUniqueID() } mode="text" onPress={() => history.push(destination)}>
        [{ children }]
      </Text>
    } else {
      return <Text key={ getUniqueID() } mode="text">
        { children }
      </Text>
    }
  }
}
