import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Colors, Headline } from 'react-native-paper'
import deepmerge from 'deepmerge'

import config from '@src/config/app'
import cssConfig from '@src/config/css'
import { reviewStyle } from '@src/styles/components/review'
import { getProgress } from '@src/Controllers/Activity/mixinProgress'
import { spinner } from '@src/styles'

import Card from '@src/Controllers/Card'

export default class Quiz extends React.Component {
  state = {
    face: [],
    current: 0,
    progress: null
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

    const limit =
      this.props.vocabulary.length > 20 ? 20 : this.props.vocabulary.length

    let current = this.state.current
    let id = this.props.vocabulary[current].id
    let recordForProgress = this.state.progress[
      config.constants.activities.types.VocabularyPairs
    ][id]
    while (
      (recordForProgress === undefined || recordForProgress === null) &&
      current < limit
    ) {
      console.log(
        'skipping card',
        recordForProgress,
        current,
        this.props.vocabulary.length
      )
      current++
      id = this.props.vocabulary[this.state.current].id
      recordForProgress = this.state.progress[
        config.constants.activities.types.VocabularyPairs
      ][id]
    }
    if (current >= limit) {
      this.props.completedActivity()

      return (
        <View style={spinner}>
          <ActivityIndicator animating color={Colors.grey400} />
        </View>
      )
    }

    const face = this.state.face
    if (face[this.state.current] === undefined) {
      face[this.state.current] = Math.random() > 0.5
    }

    return (
      <View style={reviewStyle}>
        <Headline
          style={{
            top: 48,
            position: cssConfig.FIXED,
            color: 'white',
            fontSize: 32
          }}>
          Quiz
        </Headline>
        <Card
          data={this.props.vocabulary[this.state.current]}
          face={!!face[this.state.current]}
          type={config.constants.activities.VocabularyPairs.quiz}
          faceChange={this.onFaceChange.bind(this)}
          progress={this.onProgress.bind(this)}
        />
      </View>
    )
  }

  /**
   * when a card's face changes, the user has flipped the card
   */
  onFaceChange (newState = !this.state.faces[this.state.current]) {
    const faces = this.state.faces
    faces[this.state.current] = newState
    this.setState({ faces })
  }

  onProgress (progression = config.constants.cards.forward) {
    let current = this.state.current
    switch (progression) {
      case config.constants.cards.forward:
        if (current + 1 === this.props.vocabulary.length) {
          this.onCompletedReview()
          // we have reviewed all the cards
        } else {
          current += 1
        }
        break
      case config.constants.cards.backward:
        if (current > 0) {
          current -= 1
        } else {
          console.warn(
            'there was an error in progression: attempted to go backwards from 0'
          )
        }
        break
      default:
        if (Number.isInteger(progression)) {
          if (progression < 0) {
            console.warn(
              'there was an error in progression: attempted to go (by direct assignment) earlier than 0'
            )

            progression = 0

            return
          }

          if (progression < this.props.vocabulary.length) {
            current = progression
          } else if (progression === this.props.vocabulary.length) {
            this.onCompletedReview()
          } else {
            console.warn(
              'there was an error in progression: attempted to go (by direct assignment) beyond index of vocabulary'
            )

            return
          }
        }
    }
    this.setState({ current })
  }

  onCompletedReview () {
    this.props.completedActivity()
  }
}
