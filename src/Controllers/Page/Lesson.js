import React from 'react'
import Markdown from 'react-native-markdown-renderer'

import { rules } from '@src/lib/Markdown'

class Lesson extends React.Component<Props> {
  render () {
    return <Markdown rules={rules}>{this.props.data.markdown.replace(/\\n/g, '\n')}</Markdown>
  }
}

export default Lesson
