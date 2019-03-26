import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors } from 'react-native-paper'
import deepmerge from 'deepmerge'
import Markdown from 'react-native-markdown-renderer'

import { rules } from '@src/lib/Markdown'
import config from '@src/config/app'
import { getProgress } from '@src/Controllers/Activity/extensionActivity'
import { spinner } from '@src/styles'
import { pageContainerStyle } from '@src/styles/components/page'

import FramedView from '@src/Controllers/FramedView'
import Feed from '@src/Controllers/Feed'

export default class Submission extends React.Component {
  state = {
    progress: null, // progress for submissions is 0/1, and is not part of the series used to calculate class completion. Their prupose is to allow feedback and demonstration of work.
  }

  async componentWillMount () {
    const progress = deepmerge(this.state.progress||{}, await getProgress())
    console.log('progress', progress)
    this.setState({progress})
  }

  render () {
    if(this.state.progress === null)
      return <View style={spinner}>
        <ActivityIndicator animating={true} color={Colors.grey400} />
      </View>

    const title = this.props.data.title || config.constants.activities[this.props.data.type.toUpperCase()]

    return (
      <FramedView containerStyle={pageContainerStyle} 
                  id={this.props.data.id} 
                  title={this.props.data.title}>
        <Markdown rules={rules}>
          {this.props.data.json.markdown.replace(/\\n/g, '\n')}
        </Markdown>
        <Feed type={this.props.data.type} data={this.props.data.json.feed} />
      </FramedView>
    )
  }
}
