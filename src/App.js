import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ApolloProvider } from 'react-apollo'

import config from '@src/config/app'
import history from '@src/lib/history'
import console from '@src/lib/console'
import Auth from '@src/lib/Auth'
import { getApolloClient } from '@src/lib/Graphcool'
import { Router, Switch, Route } from '@src/routing'
import Home from '@src/Controllers/Home'
import Splash from '@src/Controllers/Splash'

import {
  conditionallyAuthenticate,
  relayAuthToGraphcool,
  isAuthenticated,
  logout
} from './extensionApp.Authentication'

console.setPreface('src/App.js')

type State = {
  auth0: any, // we must authenticate with auth0 ...
  apolloClient: any, // and pass that authentication to graphcool to login
  isLoaded: boolean,
  splashMessage: string,
}

export default class App extends React.Component<*, State> {
  constructor () {
    super()

    this.state = {
      auth0: new Auth(),
      apolloClient: null,
      isLoaded: false,
      splashMessage: config.constants.messages.LOADING
    }

    this.conditionallyAuthenticate = conditionallyAuthenticate.bind(this)
    this.relayAuthToGraphcool = relayAuthToGraphcool.bind(this)
    this.isAuthenticated = isAuthenticated.bind(this)
    this.logout = logout.bind(this)
  }

  async componentDidMount () {
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

    this.setState({ apolloClient })
  }

  render () {
    if (!this.state.apolloClient) return null

    return (
      <ApolloProvider client={this.state.apolloClient}>
        <PaperProvider>
          <View style={styles.app}>
            <Router history={history}>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={props =>
                    this.state.isLoaded ? (
                      <Home
                        appAuthenticated={this.isAuthenticated.bind(this)}
                        appLogout={this.logout.bind(this)}
                        {...props}
                      />
                    ) : (
                      <Splash message={this.state.splashMessage} />
                    )
                  }
                />
                <Route
                  path='/home'
                  render={props => (
                    <Home
                      appAuthenticated={this.isAuthenticated.bind(this)}
                      appLogout={this.logout.bind(this)}
                      {...props}
                    />
                  )}
                />
              </Switch>
            </Router>
          </View>
        </PaperProvider>
      </ApolloProvider>
    )
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1
  }
})
