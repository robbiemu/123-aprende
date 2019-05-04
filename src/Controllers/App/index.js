import React from 'react'
// import { View } from 'react-native'
// export default class App extends React.Component {
//   render () {
//     return <View />
//   }
// }
import { StyleSheet, View, Platform, Linking } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ApolloProvider } from 'react-apollo'

import config from '@src/config/app'
import history from '@src/lib/history'
import { default as AppLinking } from '@src/lib/Linking'
import Auth from '@src/lib/Auth'
import twitter from '@src/lib/twitter'
import { emitter } from '@src/lib/emitter'
import { getApolloClient } from '@src/lib/Graphcool'
import { Router, Switch, Route } from '@src/routing'

import Page from '@src/Controllers/Page'
import Splash from '@src/Controllers/Splash'
import Activity from '@src/Controllers/Activity'
import Override from '@src/Controllers/Override'

import { registerForPushNotifications } from './extensionAPNs'
import {
  conditionallyAuthenticate,
  relayAuthToGraphcool,
  isAuthenticated,
  logout
} from './extensionAuthentication'

type State = {
  twitter: any,
  auth0: any, // we must authenticate with auth0 ...
  apolloClient: any, // and pass that authentication to graphcool to login
  isLoaded: boolean,
  splashMessage: string,
  expoToken: any,
}

export default class App extends React.Component<*, State> {
  constructor () {
    super()

    this.state = {
      twitter,
      auth0: new Auth(),
      apolloClient: null,
      isLoaded: false,
      splashMessage: config.constants.messages.LOADING,
      expoToken: null
    }

    if (Platform.OS === 'ios') {
      // setup linking
      Linking.addListener('url', e => {
        console.log('listening on url')
        AppLinking.onOpen(e.url)
      })

      const handler = function (arg) {
        if (arg.isLoaded) {
          this.setState({ isLoaded: true })
          history.replace(config.appHome)
        }
      }

      emitter.addListener('didRelayBBNToGraphcool', handler.bind(this))
    }

    this.registerForPushNotifications = registerForPushNotifications.bind(this)
    this.conditionallyAuthenticate = conditionallyAuthenticate.bind(this)
    this.relayAuthToGraphcool = relayAuthToGraphcool.bind(this)
    this.isAuthenticated = isAuthenticated.bind(this)
    this.logout = logout.bind(this)
  }

  async componentDidMount () {
    if (Platform.OS === 'ios') {
      if (!this.state.expoToken) {
        console.log('setting up APN', this.state.expoToken)
        await this.registerForPushNotifications()
      }
    }

    await this.conditionallyAuthenticate()

    if (this.state && !this.state.apolloClient) {
      await this.setupApollo()

      // don't forget to "t o d o - please remove" the following line i you uncomment it!
      // console.warn('logging out to allow full run')
      // this.state.auth0.logout()
    }

    await this.relayAuthToGraphcool()
  }

  /** get our initial app state cache and connect to graphcool */
  async setupApollo () {
    const apolloClient = await getApolloClient()
    console.log('setting up apollo')

    this.setState({ apolloClient })
  }

  render () {
    if (!this.state.apolloClient) return null

    return (
      <ApolloProvider client={this.state.apolloClient}>
        <PaperProvider>
          <View style={styles.app}>
            <Router history={history}>
              {!this.state.isLoaded ? (
                <Switch>
                  <Route
                    path='/'
                    render={() => (
                      <Splash
                        message={this.state.splashMessage}
                        spinner
                        signout={this.signout.bind(this)}
                      />
                    )}
                  />
                </Switch>
              ) : (
                <Switch>
                  <Route
                    path='/callback'
                    render={() => (
                      <Splash
                        message={this.state.splashMessage}
                        spinner
                        signout={this.signout.bind(this)}
                      />
                    )}
                  />
                  <Route
                    exact
                    path='/override'
                    render={props => (
                      <Page
                        id={config.constants.graphcool.HOME_PAGE_ID}
                        signout={this.signout.bind(this)}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path='/'
                    render={props => (
                      <Page
                        id={config.constants.graphcool.HOME_PAGE_ID}
                        signout={this.signout.bind(this)}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    path={config.appHome}
                    render={props => (
                      <Page
                        id={config.constants.graphcool.HOME_PAGE_ID}
                        signout={this.signout.bind(this)}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    path='/page/:id'
                    render={props => (
                      <Page {...props} signout={this.signout.bind(this)} />
                    )}
                  />
                  <Route
                    path='/override'
                    render={props => (
                      <Override
                        appAuthenticated={this.isAuthenticated.bind(this)}
                        appLogout={this.signout.bind(this)}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    path='/activity/:activity_id/:presentation?'
                    render={props => (
                      <Activity {...props} signout={this.signout.bind(this)} />
                    )}
                  />
                </Switch>
              )}
            </Router>
          </View>
        </PaperProvider>
      </ApolloProvider>
    )
  }

  signout () {
    this.state.auth0.logout()
    this.setState({ isLoaded: false })

    history.replace('/')

    const self = this
    setTimeout(function () {
      self.setState({ isLoaded: false })
      history.replace('/callback')
      self.componentDidMount()
    }, 1000)
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1
  }
})
