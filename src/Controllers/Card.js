import React from "react"
import { Card as NativeCard, Title, Paragraph, Headline } from 'react-native-paper';

import config from '@src/config/app'
import { cardStyle, cardContentStyle } from '@src/styles/components/card'

export default class Card extends React.Component {
  render() {
    console.log(this.props.type, config.constants.activities.VocabularyPairs.review)
    switch (this.props.type) {
      case config.constants.activities.VocabularyPairs.review:
        return (
            <NativeCard style={cardStyle} elevation={8} accessible={true} onPress={this.onPress.bind(this)}>
              <NativeCard.Content style={cardContentStyle}>
                <Title style={{fontSize: "48pt", padding: 8}}>{this.props.data[config.constants.cards.faces[this.props.face]].number}</Title>
                <Headline style={{ textAlign: 'center'}}>{this.props.data[config.constants.cards.faces[this.props.face]].glyphs}</Headline>
                <Paragraph style={{ textAlign: 'center'}}>{this.props.data[config.constants.cards.faces[!this.props.face]].glyphs}</Paragraph>
              </NativeCard.Content>
            </NativeCard>
        )
      default:
        return <h1>{this.props.data[config.constants.cards.faces[this.props.face]]}</h1>
    }
  }

  onPress () {
    switch (this.props.type) {
      case config.constants.activities.VocabularyPairs.review:
        typeof this.props.progress === 'function' ? this.props.progress(): console.warn('no progress function set!')
        break
      default:
        console.warn(`unimplemented VocabularyPairs type ${this.props.type}`)
    }
  }
}