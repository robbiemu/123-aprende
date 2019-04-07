import React from 'react'
import { View } from 'react-native'
import Markdown from 'react-native-markdown-renderer'

import { rules } from '@src/lib/Markdown'
import { pageStyle } from '@src/styles/components/page'

class Page extends React.Component<Props> {
  render () {
    return (
      <View style={pageStyle}>
        <Markdown rules={rules}>
          {this.props.data.markdown.replace(/\\n/g, '\n')}
        </Markdown>
      </View>
    )
  }
}

export default Page
