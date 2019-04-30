import React from 'react'
// import { View } from 'react-native'
//
// export default class Splash extends React.Component {
//   render () {
//     return <View />
//   }
// }

import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import {
  Headline,
  withTheme,
  type Theme,
  Paragraph,
  ActivityIndicator,
  Colors
} from 'react-native-paper'

import config from '@src/config/app'
import cssConfig from '@src/config/css'

type Props = {
  theme: Theme,
  message: String,
  spinner: boolean,
}

class Splash extends React.Component<Props> {
  constructor () {
    super()

    this.state = {
      canSpin: true
    }

    const self = this
    setTimeout(function () {
      self.setState({ canSpin: false })
    }, 10 * 1000)
  }

  render () {
    return (
      <View style={styles.container}>
        <Headline style={styles.header}>{config.states.app.appName}</Headline>
        {this.props.spinner && this.state.canSpin ? (
          <View style={styles.body}>
            <View style={styles.spinner} elevation={2}>
              <ActivityIndicator animating color={Colors.grey400} />
            </View>
            <TouchableOpacity
              onPress={this.signout.bind(this)}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image
                style={{ width: 256, height: 256 }}
                source={require('@src/media/123go-big.png')}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.body}>
            <Paragraph>{this.props.message || ''}</Paragraph>
            <TouchableOpacity
              onPress={this.signout.bind(this)}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image
                style={{ width: 256, height: 256 }}
                source={require('@src/media/123go-big.png')}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  signout () {
    console.log('signing out')
    this.props.signout()
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    paddingVertical: 12
  },
  header: {
    paddingVertical: 36,
    textAlign: 'center'
  },
  body: {
    position: cssConfig.FIXED,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 3,
    paddingHorizontal: 3
  },
  spinner: {
    position: cssConfig.FIXED,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    zIndex: 2
  }
})

export default withTheme(Splash)
