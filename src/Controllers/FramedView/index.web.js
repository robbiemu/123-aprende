import React from 'react'
import { View, ScrollView } from 'react-native'

import history from '@src/lib/history'

import Appbar from '@src/Controllers/Appbar'
import Drawer from '@src/Controllers/Drawer'
import { appbarPadding } from '@src/styles/components/appbar'

type Props = {
  id: string,
  title: string,
  containerStyle: object,
  data: object,
  dataType: object,
}

export default class FramedView extends React.Component<Props> {
  state = {
    isShowingDrawer: false
  }

  render () {
    return (
      <View>
        {this.state.isShowingDrawer && (
          <Drawer
            isShowingDrawer={this.state.isShowingDrawer}
            toggleDrawer={this.toggleDrawer.bind(this)}
            data={{ from: this.props.dataType, context: this.props.data }}
          />
        )}
        <View>
          <Appbar
            data={{ id: this.props.id, title: this.props.title }}
            goBack={this.goBack.bind(this)}
            toggleDrawer={this.toggleDrawer.bind(this)}
          />
          <ScrollView style={appbarPadding}>
            <View style={this.props.containerStyle}>{this.props.children}</View>
          </ScrollView>
        </View>
      </View>
    )
  }

  goBack () {
    history.goBack()
  }

  toggleDrawer () {
    this.setState({ isShowingDrawer: !this.state.isShowingDrawer })
  }
}
