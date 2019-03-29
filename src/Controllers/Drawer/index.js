import React from 'react'
import { ScrollView, Modal, TouchableOpacity } from 'react-native'
import { Drawer as NativeDrawer } from 'react-native-paper'
import uuid from 'uuid/v4'

import history from '@src/lib/history'
import { drawerStyle, drawerItemStyle } from '@src/styles/components/drawer'
import { modalParentStyle, modalTransparentStyle } from '@src/styles/modal'

import { drawerItems, generateItemWithContext } from './extensionDrawerItems'

type Props = {
  data: object,
  toggleDrawer: Function,
}

class Drawer extends React.Component<Props> {
  render () {
    console.log('rendering drawer with', this.props.data)

    return (
      <Modal
        style={modalParentStyle}
        transparent
        visible={this.props.isShowingDrawer}
        animationType='slide'
        onRequestClose={() => {}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.props.toggleDrawer}
          style={modalTransparentStyle}>
          <TouchableOpacity activeOpacity={1} style={drawerStyle} elevation={8}>
            <ScrollView>
              {drawerItems.map(data => {
                data = generateItemWithContext(data, this.props.data.context)

                return (
                  <NativeDrawer.Item
                    key={uuid()}
                    style={drawerItemStyle}
                    icon={data.icon}
                    label={data.label}
                    active={data.active}
                    onPress={() => this.navigate(data)}
                  />
                )
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    )
  }

  navigate (data) {
    if (typeof data.navigate === 'function') {
      data.navigate() && this.props.toggleDrawer()
    } else if (data.to) {
      this.props.toggleDrawer()

      history.push(data.to)
    } else {
      this.props.toggleDrawer()

      history.goBack()
    }
  }
}

export default Drawer
