import React from 'react'
import { View } from 'react-native'
import { Paragraph } from 'react-native-paper'
import AsyncStorage from '@callstack/async-storage'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import config from '@src/config/app'
import history from '@src/lib/history'

import Review from './Review'

const GET_ACTIVITY = gql`query activity ($id: ID) {
  Activity (id: $id) {
    id,
    json,
    title,
    type
  }
}`

class Activity extends React.Component {
  state = {
    graphcool_id: null,
    appid: config.appId,
    appidInput: '',
    appName: config.appName,
    appNameInput: '',
    uid: '',
    uidInput: '',
    metric: ''
  }

  async componentDidMount () {
    const uid = await AsyncStorage.getItem(
        config.constants.bbn.connectionDetails.uid
    )

    const graphcool_id = await AsyncStorage.getItem(
        config.constants.graphcool.user_id
    )

    if (!uid || !graphcool_id) return

    this.setState({
      uid,
      graphcool_id
    })
  }

  render () {
    return (<Query
            query={GET_ACTIVITY}
            fetchPolicy='network-only'
            variables={{ id: this.props.match.params.activity_id }}>
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
                case config.constants.activities.types.Activity:
                default:
                  console.warn(`activity type '${data.Activity.type}' not implemented`)
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
        return <Review vocabulary={data.Activity.json} completedActivity={this.onCompletedActivity} />
      case config.constants.activities.VocabularyPairs.quiz:
      case config.constants.activities.VocabularyPairs.test:
      case config.constants.activities.VocabularyPairs.memoryGame:
      case config.constants.activities.VocabularyPairs.list:
      default:
        return //<List vocabulary={data.Activity.json} completedActivity={onCompletedActivity} />
    }
  }

  onCompletedActivity() {
    history.goBack()
  }
}

export default Activity
