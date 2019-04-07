import React from 'react'
import { View } from 'react-native'
import { applyStyle } from 'react-native-markdown-renderer'

import { styles as customStyles } from '@src/styles/markdown'

export let rules = {
  heading3: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={{ ...customStyles.heading3, ...styles.headingContainer }}>
      {applyStyle(
        children,
        [styles.heading, styles.heading3, customStyles.heading3Text],
        'Text'
      )}
    </View>
  ),
  heading2: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={{ ...customStyles.heading2, ...styles.headingContainer }}>
      {applyStyle(
        children,
        [styles.heading, styles.heading2, customStyles.heading2Text],
        'Text'
      )}
    </View>
  )
}
