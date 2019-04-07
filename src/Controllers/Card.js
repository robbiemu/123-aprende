import React from 'react'
import { TextInput as NativeTextInput, Platform, View } from 'react-native'
import {
  Card as PaperCard,
  TextInput,
  Title,
  Paragraph,
  Headline,
  ActivityIndicator,
  Colors
} from 'react-native-paper'
import AsyncStorage from '@callstack/async-storage'
import deepmerge from 'deepmerge'
import FuzzySet from 'fuzzyset.js'

import config from '@src/config/app'
import { getProgress } from '@src/Controllers/Activity/mixinProgress'
import {
  cardStyle,
  cardContentStyle,
  cardTextInputStyle,
  cardNativeTextInputStyle
} from '@src/styles/components/card'
import { spinner } from '@src/styles'

export default class Card extends React.Component {
  state = {
    text: '',
    progress: null,
    currentFace: false,
    shown: false
  }

  async componentWillMount () {
    const progress = deepmerge(this.state.progress || {}, await getProgress())
    console.log('progress', progress)
    this.setState({ progress })
  }

  componentWillUnmount () {
    // this.state.progress.vocabularyPairs[this.props.data] = progress.vocabularyPairs[this.props.data] ?
  }

  render () {
    if (this.state.progress === null) {
      return (
        <View style={spinner}>
          <ActivityIndicator animating color={Colors.grey400} />
        </View>
      )
    }

    const recordForProgress = this.state.progress[
      config.constants.activities.types.VocabularyPairs
    ][this.props.data.id]

    const cardFace = this.props.data
    const face =
      config.constants.cards.faces[this.props.face || this.state.currentFace]
    const oppositeFace =
      config.constants.cards.faces[!(this.props.face || this.state.currentFace)]

    switch (this.props.type) {
      case config.constants.activities.VocabularyPairs.test:
      case config.constants.activities.VocabularyPairs.quiz:
      case config.constants.activities.VocabularyPairs.review:
        if (recordForProgress === null || recordForProgress === undefined) {
          // first showing
          return (
            <PaperCard
              style={cardStyle}
              elevation={8}
              accessible
              onPress={this.onPress.bind(this)}>
              <PaperCard.Content style={cardContentStyle}>
                <Title style={{ fontSize: '48pt', padding: 8 }}>
                  {cardFace[face].number}
                </Title>
                <Headline style={{ textAlign: 'center' }}>
                  {cardFace[face].glyphs}
                </Headline>
                <Paragraph style={{ textAlign: 'center' }}>
                  {cardFace[oppositeFace].glyphs}
                </Paragraph>
              </PaperCard.Content>
            </PaperCard>
          )
        }
        /* not the first time a card is shown */
        return !this.state.shown ? (
          /** before they guess */
          <PaperCard style={cardStyle} elevation={8} accessible>
            <PaperCard.Content style={cardContentStyle}>
              <Title style={{ fontSize: '48pt', padding: 8 }}>
                {cardFace[face].number}
              </Title>
              <Headline style={{ textAlign: 'center' }}>
                {cardFace[face].glyphs}
              </Headline>
              {Platform.OS === 'ios' ? (
                <TextInput
                  mode={'outlined'}
                  label={config.constants.cards.faces[!this.props.face]}
                  style={cardTextInputStyle}
                  value={this.state.text}
                  onChangeText={text => this.setState({ text })}
                  onEndEditing={this.evaluate.bind(this)}
                />
              ) : (
                <NativeTextInput
                  mode={'outlined'}
                  placeholder={config.constants.cards.faces[!this.props.face]}
                  style={cardNativeTextInputStyle}
                  value={this.state.text}
                  onChangeText={text => this.setState({ text })}
                  onBlur={this.evaluate.bind(this)}
                />
              )}
            </PaperCard.Content>
          </PaperCard>
        ) : (
          /** after they guess */
          <PaperCard
            style={cardStyle}
            elevation={8}
            accessible
            onPress={this.onPress.bind(this)}>
            <PaperCard.Content style={cardContentStyle}>
              <Title style={{ fontSize: '48pt', padding: 8 }}>
                {cardFace[face].number}
              </Title>
              <Paragraph style={{ textAlign: 'center' }}>
                {cardFace[face].glyphs}
              </Paragraph>
              <Headline
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'orange'
                }}>
                {cardFace[oppositeFace].glyphs}
              </Headline>
            </PaperCard.Content>
          </PaperCard>
        )
      default:
        return (
          <h1>
            {this.props.data[config.constants.cards.faces[this.props.face]]}
          </h1>
        )
    }
  }

  /** evaluate user input against the expected values */
  async evaluate () {
    console.log('evaluating')
    const guess = this.state.text.toLowerCase().trim()
    const evaluations = (
      this.props.data[config.constants.cards.faces[this.props.face]]
        .evaluateAs || []
    ).map(word => word.toLowerCase().trim())
    evaluations.push(
      this.props.data[config.constants.cards.faces[!this.props.face]].glyphs
    )

    const matches = evaluations.some(representation => {
      const word = representation
      return word === guess
    })

    if (matches) {
      await this.accept()
    } else {
      const fs = FuzzySet(evaluations, false)
      const matches = fs.get(guess)

      console.log('first failed, matches now:', matches)
      if (matches) {
        // accept as typo
        await this.accept(false)
      } else {
        this.decline()
      }
    }
  }

  async accept (isAcceptedAsTypo) {
    const alpha = this.state.progress[
      config.constants.activities.types.VocabularyPairs
    ][this.props.data.id]
    const numerator = (1 - alpha) * this.getModifier()

    const progress = this.state.progress
    progress[config.constants.activities.types.VocabularyPairs][
      this.props.data.id
    ] = alpha === undefined ? 0 : numerator / 2 + alpha
    if (
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] > 1
    )
    // should be impossible, but floats, you know
    {
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] = 1
    }

    this.setState({ progress })

    await this.complete()
  }

  decline () {
    const alpha = this.state.progress[
      config.constants.activities.types.VocabularyPairs
    ][this.props.data.id]
    const progress = this.state.progress
    if (alpha === 0 || alpha === undefined || alpha === null) {
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] = 0
    } else {
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] = alpha === 0 ? 0 : (1 - alpha) / 8 + alpha - (1 - alpha) / 2
    }
    if (
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] < 0
    )
    // should be impossible, but floats, you know
    {
      progress[config.constants.activities.types.VocabularyPairs][
        this.props.data.id
      ] = 0
    }

    this.setState({ progress })

    this.flip()
  }

  flip () {
    this.setState({
      currentFace: !this.state.currentFace,
      shown: true,
      progress: this.state.progress
    })
  }

  /* allow tests to help more advanced students "skip ahead"  */
  getModifier () {
    switch (this.props.type) {
      case config.constants.activities.VocabularyPairs.test:
        return 1.9
      case config.constants.activities.VocabularyPairs.quiz:
      case config.constants.activities.VocabularyPairs.review:
        return 1
      default:
        console.warn(`unimplemented VocabularyPairs type ${this.props.type}`)
        return 0
    }
  }

  async onPress () {
    switch (this.props.type) {
      case config.constants.activities.VocabularyPairs.test:
      case config.constants.activities.VocabularyPairs.quiz:
      case config.constants.activities.VocabularyPairs.review:
        if (!this.state.shown) {
          const progress = this.state.progress
          progress[config.constants.activities.types.VocabularyPairs][
            this.props.data.id
          ] = 0

          this.setState({ progress })
        }

        await this.complete()
        break
      default:
        console.warn(`unimplemented VocabularyPairs type ${this.props.type}`)
    }
  }

  async complete () {
    this.setState({ shown: false, currentFace: false, text: '' })

    await AsyncStorage.setItem(
      config.constants.graphcool.progress,
      JSON.stringify(this.state.progress)
    )

    typeof this.props.progress === 'function'
      ? this.props.progress()
      : console.warn('no progress function set!')
  }
}
