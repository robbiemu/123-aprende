import React, { Fragment } from 'react'
import { View, ScrollView, SafeAreaView } from 'react-native'

import history from '@src/lib/history'

import Appbar from '@src/Controllers/Appbar'
import Drawer from '@src/Controllers/Drawer'
import { appbarPadding } from '@src/styles/components/appbar'
import { DefaultTheme } from 'react-native-paper'

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
      <Fragment>
        <SafeAreaView
          style={{ backgroundColor: DefaultTheme.colors.primary }}
        />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: DefaultTheme.colors.surface }}>
          <View style={{ flex: 1 }}>
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
              <ScrollView style={appbarPadding}>
                <View style={this.props.containerStyle}>
                  {this.props.children}
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    )
  }

  goBack () {
    history.goBack()
  }

  toggleDrawer () {
    this.setState({ isShowingDrawer: !this.state.isShowingDrawer })
  }
}
