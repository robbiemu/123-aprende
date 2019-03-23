import React from "react";
import { View } from 'react-native'
import AsyncStorage from '@callstack/async-storage'

import config from '@src/config/app'
import { reviewStyle } from '@src/styles/components/review'

import Card from '@src/Controllers/Card'


export default class Review extends React.Component {
  state = {
    graphcool_id: null,
    uid: '',
    face: [],
    current: 0
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
    return <View style={reviewStyle}>
      <Card
        data={this.props.vocabulary[this.state.current]}
        face={!!this.state.face[this.state.current]}
        type={config.constants.activities.VocabularyPairs.review}
        faceChange={this.onFaceChange.bind(this)}
        progress={this.onProgress.bind(this)} />
    </View>
  }

  /**
   * when a card's face changes, the user has flipped the card
   */
  onFaceChange (newState=!this.state.faces[this.state.current]) {
    const faces = this.state.faces
    faces[this.state.current] = newState
    this.setState({faces})
  }

  onProgress (progression=config.constants.cards.forward) {
    let current = this.state.current
    switch (progression) {
      case config.constants.cards.forward:
        if(current + 1 === this.props.vocabulary.length) {
          this.onCompletedReview()
          // we have reviewed all the cards
        } else {
          current += 1
        }
        break
      case config.constants.cards.backward:
        if(current > 0) {
          current -= 1
        } else {
          console.warn('there was an error in progression: attempted to go backwards from 0')
        }
        break
      default:
        if(Number.isInteger(progression)) {
          if(progression < 0) {
            console.warn('there was an error in progression: attempted to go (by direct assignment) earlier than 0')

            return
          }

          if(progression < this.props.vocabulary.length) {
            current = progression
          } else if (progression === this.props.vocabulary.length) {
            this.onCompletedReview()
          } else {
            console.warn('there was an error in progression: attempted to go (by direct assignment) beyond index of vocabulary')

            return
          }
        }
    }
    this.setState({current})
  }

  onCompletedReview() {
    this.props.completedActivity()
  }
}
