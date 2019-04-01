import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors, Headline } from 'react-native-paper'
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
    progress: null // progress for submissions is 0/1, and is not part of the series used to calculate class completion. Their prupose is to allow feedback and demonstration of work.
  }

  async componentWillMount () {
    const progress = deepmerge(this.state.progress || {}, await getProgress())
    this.setState({ progress })
  }

  render () {
    if (this.state.progress === null) {
      return (
        <View style={spinner}>
          <ActivityIndicator animating color={Colors.grey400} />
        </View>
      )
    }

    const title =
      this.props.data.title ||
      config.constants.activities[this.props.data.type.toUpperCase()]

    return (
      <FramedView
        containerStyle={pageContainerStyle}
        id={this.props.data.id}
        title={title}>
        <Markdown rules={rules}>
          {this.props.data.json.markdown.replace(/\\n/g, '\n')}
        </Markdown>
        <View>
          <Headline>Submit your media!</Headline>
          {this.props.children}
        </View>
        {this.props.data.json.feed && (
          <Feed
            search='video'
            type={this.props.data.type}
            data={this.props.data.json.feed}
          />
        )}
        {this.props.data.json.twitter && (
          <Feed
            search='twitter'
            type={this.props.data.type}
            data={this.props.data.json.twitter}
          />
        )}
      </FramedView>
    )
  }
}
