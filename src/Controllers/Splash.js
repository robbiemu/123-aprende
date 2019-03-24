import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import {
  Headline,
  withTheme,
  type Theme,
  Paragraph,
  ActivityIndicator,
  Colors
} from 'react-native-paper'

import config from '@src/config/app'

type Props = {
  theme: Theme,
  message: String,
  spinner: boolean
}

class Splash extends React.Component<Props> {
  render() {
    return (<View style={styles.container}>
          <Headline style={styles.header}>{ config.states.app.appName }</Headline>
          {this.props.spinner?
              (<View style={styles.body}>
                  <View style={styles.spinner} elevation={2}>
                      <ActivityIndicator animating={true} color={Colors.grey400} />
                  </View>
                  <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 512, height: 512}} source={require('@src/media/123go-big.png')}/>
                  </View>
              </View>):
              (<View style={styles.body}>
                <Paragraph>{ this.props.message || '' }</Paragraph>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 256, height: 256}} source={require('@src/media/123go-big.png')}/>
                </View>
              </View>)
          }
      </View>)
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
    position: 'fixed',
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
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    opacity:0.5,
    zIndex:2
  }
})

export default withTheme(Splash)
  