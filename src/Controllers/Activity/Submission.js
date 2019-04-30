import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors, Headline, Text } from 'react-native-paper'
import deepmerge from 'deepmerge'
import Markdown from 'react-native-markdown-renderer'

import config from '@src/config/app'
import history from '@src/lib/history'
import { rules } from '@src/lib/Markdown'
import { getProgress } from '@src/Controllers/Activity/mixinProgress'
import { spinner } from '@src/styles'
import { pageContainerStyle, lessonStyle } from '@src/styles/components/page'

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

    const requirements =
      '/page/' + config.constants.graphcool.REQUIREMENTS_PAGE_ID
    const resources = '/page/' + config.constants.graphcool.RESOURCES_PAGE_ID

    return (
      <FramedView
        signout={this.props.signout}
        containerStyle={pageContainerStyle}
        id={this.props.data.id}
        title={title}>
        <View style={lessonStyle}>
          <Markdown rules={rules}>
            {this.props.data.json.markdown.replace(/\\n/g, '\n')}
          </Markdown>
          <Text>
            see <Text onPress={() => history.push(resources)}>[resources]</Text>{' '}
            for instructions on how to submit a recording.
          </Text>
          <Text>
            see{' '}
            <Text onPress={() => history.push(requirements)}>
              [requirements]
            </Text>{' '}
            for details about what accounts you need in order to participate
            with us in social media.
          </Text>
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
        </View>
      </FramedView>
    )
  }
}
