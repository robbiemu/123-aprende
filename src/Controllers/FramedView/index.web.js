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

const scrollviewStyle = {
  ...appbarPadding,
  overflowY: 'scroll',
  height: 'calc(100vh - 56px)'
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
            signout={this.props.signout}
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
          <ScrollView style={scrollviewStyle}>
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
