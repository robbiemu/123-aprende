import React from 'react'
import { Appbar as NativeAppbar } from 'react-native-paper'

import config from '@src/config/app'
import { appbarStyle } from '@src/styles/components/appbar'

type Props = {
  data: object,
  goBack: Function,
  toggleDrawer: Function
}

class Appbar extends React.Component<Props> {
  render () {
    console.log('rendering appbar with', this.props.data)
    return (<NativeAppbar.Header dark={true} style={appbarStyle}>
      { (this.props.data.id !== config.constants.graphcool.HOME_PAGE_ID) && <NativeAppbar.BackAction onPress={this.props.goBack} /> }
      { this.props.data.title
          ? <NativeAppbar.Content title={this.props.data.title} />
          : <NativeAppbar.Content title={config.states.app.appName} />
      }
      <NativeAppbar.Action icon="more-vert" onPress={this.onMore.bind(this)} />
    </NativeAppbar.Header>)
  }

  onMore() {
    this.props.toggleDrawer()
  }
}

export default Appbar