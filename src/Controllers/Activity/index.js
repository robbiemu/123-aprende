import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors, Paragraph } from 'react-native-paper'
import AsyncStorage from '@callstack/async-storage'
import { Query } from 'react-apollo'

import config from '@src/config/app'
import cssConfig from '@src/config/css'
import history from '@src/lib/history'
import User from '@src/Models/User'
import ActivityModel from '@src/Models/Activity'
import { getRawClient } from '@src/lib/Graphcool'

import Review from './VocabularyPairs/Review'
import List from './VocabularyPairs/List'
import Quiz from './VocabularyPairs/Quiz'
import Test from './VocabularyPairs/Test'
import Submission from '@src/Controllers/Activity/Submission'

class Activity extends React.Component {
  state = {
    graphcool_id: null,
    apolloClient: null
  }

  async componentDidMount () {
    let apolloClient = await getRawClient()

    // ensure loaded user progress at start of activity
    await apolloClient
      .query({ query: User.self, forceFetch: true })
      .then(async ({ data }) => {
        if (!data.user) {
          // we didn't sign in?
          console.error('error using connected data')
        } else {
          await AsyncStorage.setItem(
            config.constants.graphcool.progress,
            JSON.stringify(data.user.progress)
          )

          console.log('user data', data.user)
        }
      })

    const graphcool_id = await AsyncStorage.getItem(
      config.constants.graphcool.user_id
    )

    if (!graphcool_id) return

    this.setState({
      graphcool_id,
      apolloClient
    })
  }

  render () {
    if (!this.state.graphcool_id) {
      return (
        <View
          style={{
            position: cssConfig.FIXED,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: Colors.black,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
            zIndex: 2
          }}
          elevation={2}>
          <ActivityIndicator animating color={Colors.grey400} />
        </View>
      )
    }

    return (
      <Query
        query={ActivityModel.getActivity}
        fetchPolicy='network-only'
        variables={{
          id:
            this.props.match.params.activity_id ||
            config.constants.graphcool.MASTER_LIST_ID
        }}>
        {result => {
          let { data, error } = result

          console.log(
            'results from activity query in Activity',
            Object.assign({}, data)
          )

          if (error) {
            console.error('error', error)
            return (
              <View>
                <Paragraph>{error.message}</Paragraph>
              </View>
            )
          }

          if (data && data.Activity && data.Activity.json) {
            switch (data.Activity.type) {
              case config.constants.activities.types.VocabularyPairs:
                return this.renderVocabularyPairs(data)
              case config.constants.activities.types.VideoSubmission:
              case config.constants.activities.types.AudioSubmission:
                return this.renderSubmission(data)
              case config.constants.activities.types.Activity:
              default:
                console.warn(
                  `activity type '${data.Activity.type}' not implemented`
                )
                return (
                  <View>
                    <Paragraph>{JSON.stringify(data.Activity.type)}</Paragraph>
                    <Paragraph>{JSON.stringify(data.Activity.json)}</Paragraph>
                  </View>
                )
            }
          }

          return (
            <View>
              <Paragraph>Loading activity</Paragraph>
            </View>
          )
        }}
      </Query>
    )
  }

  renderVocabularyPairs (data) {
    switch (this.props.match.params.presentation) {
      case config.constants.activities.VocabularyPairs.review:
        return (
          <Review
            vocabulary={data.Activity.json}
            completedActivity={this.onCompletedActivity.bind(this)}
          />
        )
      case config.constants.activities.VocabularyPairs.list:
        return (
          <List
            vocabulary={data.Activity.json}
            completedActivity={this.onCompletedActivity.bind(this)}
          />
        )
      case config.constants.activities.VocabularyPairs.quiz:
        return (
          <Quiz
            vocabulary={data.Activity.json}
            completedActivity={this.onCompletedActivity.bind(this)}
          />
        )
      case config.constants.activities.VocabularyPairs.test:
        return (
          <Test
            vocabulary={data.Activity.json}
            completedActivity={this.onCompletedActivity.bind(this)}
          />
        )
      case config.constants.activities.VocabularyPairs.memoryGame:
      default:
         // <List vocabulary={data.Activity.json} completedActivity={onCompletedActivity} />
    }
  }

  renderSubmission (data) {
    return <Submission data={data.Activity} />
  }

  onCompletedActivity () {
    const self = this
    AsyncStorage.getItem(config.constants.graphcool.progress).then(progress => {
      console.log('activity')

      const variables = {
        id: this.state.graphcool_id,
        progress: JSON.parse(progress)
      }

      self.state.apolloClient.mutate({
        mutation: User.saveProgress,
        variables
      })
    })

    history.goBack()
  }
}

export default Activity
