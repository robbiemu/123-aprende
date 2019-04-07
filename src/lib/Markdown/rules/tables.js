import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

import { styles as customStyles } from '@src/styles/markdown'

export let rules = {
  table: (node, children, parent, styles) => (
    <View key={node.key} style={customStyles.table}>
      {children}
    </View>
  ),
  tbody: (node, children, parent, styles) => (
    <View key={node.key}>{children}</View>
  ),
  tr: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={customStyles.tableRow}>
        {children}
      </View>
    )
  },
  th: (node, children, parent, styles) => {
    let cellIsToBeRemoved = false
    let content
    try {
      content = children[0].props.children[0].props.children

      cellIsToBeRemoved = /^\{remove\}/.test(content)

      content = content.replace(/^\{[^}]+\}/, '')
    } catch (e) {
      content = ''
    }

    return (
      <View key={node.key} style={cellIsToBeRemoved && customStyles.removeCell}>
        <Text>{content}</Text>
      </View>
    )
  },
  td: (node, children, parent, styles) => {
    let cellIsHeader = false
    let content
    try {
      content = children[0].props.children[0].props.children

      cellIsHeader = /^\{th\}/.test(content)

      content = content.replace(/^\{[^}]+\}/, '')
    } catch (e) {
      content = ''
    }

    let cellStyle = cellIsHeader
      ? customStyles.tableHeaderCell
      : customStyles.tableRowCell

    let cellTextStyle = cellIsHeader
      ? customStyles.tableHeaderText
      : customStyles.tableRowText

    return (
      <View key={node.key} style={cellStyle}>
        <Text style={cellTextStyle}>{content}</Text>
      </View>
    )
  }
}
