import React from 'react'
import { View } from 'react-native'
import Markdown from 'react-native-markdown-renderer'

import { rules } from '@src/lib/Markdown'
import { lessonStyle } from '@src/styles/components/page'

class Lesson extends React.Component {
  render () {
    // console.log(this.props.data.markdown.replace(/\\n/g, '\n'))
    return (
      <View style={lessonStyle}>
        <Markdown rules={rules}>
          {this.props.data.markdown.replace(/\\n/g, '\n')}
        </Markdown>
      </View>
    )
  }
}

export default Lesson
