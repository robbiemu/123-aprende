import React from 'react'
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { ActivityIndicator, Colors, Headline, List as NativeList } from 'react-native-paper'

import config from '@src/config/app'
import { getProgress } from '@src/Controllers/Activity/Activity'
import deepmerge from 'deepmerge'
import { spinner } from '@src/styles'
import { listStyle, listTouchableStyle } from '@src/styles/components/list'

export default class List extends React.Component {
  state = {
    progress: null,
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

    return (
        <TouchableWithoutFeedback style={listTouchableStyle} onPress={this.props.completedActivity}>
          <NativeList.Section style={listStyle}>
            <View>
              <Headline>{ this.props.title || config.constants.activities.LIST }</Headline>
            </View>
            <ScrollView>
              { this.props.vocabulary.map((item, index) => {
                const itemProgress = this.state.progress[config.constants.activities.types.VocabularyPairs][item.id]
                return <NativeList.Item key={ index}
                                        title={item.es.glyphs}
                                        left={ () => <NativeList.Icon icon={itemProgress >= 0.95 ? 'check-box': 'check-box-outline-blank'} /> }
                />
              })
              }
            </ScrollView>
          </NativeList.Section>
        </TouchableWithoutFeedback>
    )
  }
}
