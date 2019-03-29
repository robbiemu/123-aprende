/* @flow */

import React from 'react'
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native'
import {
  Button,
  Chip,
  TextInput,
  Caption,
  Headline,
  Paragraph,
  withTheme,
  type Theme
} from 'react-native-paper'
import AsyncStorage from '@callstack/async-storage'
import uuid from 'uuid/v4'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import Firebase from '@src/lib/Firebase'
import config from '@src/config/app'
import { config as firebaseConfig } from '@src/config/firebase'

type Props = {
  theme: Theme,
  appAuthenticated: boolean,
  appLogout: Function,
}

const GET_USERS = gql`
  query tokens {
    user {
      tokens {
        deviceToken
      }
    }
  }
`
const POLL_STATUS = 6

class Override extends React.Component<Props> {
  state = {
    graphcool_id: null,
    appid: config.appId,
    appidInput: '',
    appName: config.appName,
    appNameInput: '',
    uid: '',
    uidInput: '',
    metric: ''
  }

  async componentDidMount () {
    const uid = await AsyncStorage.getItem(
      config.constants.bbn.connectionDetails.uid
    )

    const graphcool_id = await AsyncStorage.getItem(
      config.constants.graphcool.user_id
    )

    if (!uid || !graphcool_id) return

    this.setState({
      uid,
      graphcool_id
    })

    console.log(`uid ${uid} graphocool:user_id ${graphcool_id}`)
  }

  render () {
    const {
      theme: {
        colors: { background }
      }
    } = this.props

    const uid = this.state.uid ? (
      <Chip icon='account-circle' onClose={e => this.setState({ uid: '' })}>
        {this.state.uid}
      </Chip>
    ) : (
      this.factoryInput(
        'uid',
        'UID',
        <Button
          mode='contained'
          dark
          compact
          onPress={e => this.setState({ uid: uuid() })}>
          generate
        </Button>
      )
    )

    const appid = this.state.appid ? (
      <Chip icon='apps' onClose={e => this.setState({ appid: '' })}>
        {this.state.appid}
      </Chip>
    ) : (
      this.factoryInput('appid', 'app ID')
    )

    const appname = this.state.appName ? (
      <Chip icon='apps' onClose={e => this.setState({ appName: '' })}>
        {this.state.appName}
      </Chip>
    ) : (
      this.factoryInput('appName', 'app name')
    )

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Headline style={styles.text}>Third Party Demo</Headline>

        <Caption style={styles.text}>description</Caption>
        <Paragraph style={styles.text}>
          Give yourself a metric. Optionally, also provide a uid to do it with.
          It should show up in the firestore.
        </Paragraph>

        <Caption style={styles.text}>uid</Caption>
        {uid}

        <Caption style={styles.text}>app id</Caption>
        {appid}

        <Caption style={styles.text}>app name</Caption>
        {appname}

        <Caption style={styles.text}>metric</Caption>
        <TextInput
          label='number'
          value={this.state.metric}
          onChangeText={this.onChangeMetric}
        />

        <Button
          icon='gavel'
          mode='contained'
          dark
          compact
          disabled={
            !(
              this.state.uid &&
              this.state.appid &&
              this.state.appName &&
              this.isValidMetric()
            )
          }
          onPress={this.onCommitMetric}>
          send metric
        </Button>

        <Caption style={styles.text}>etc</Caption>

        <Button
          mode='contained'
          dark
          compact
          disabled={!this.props.appAuthenticated()}
          onPress={this.logout.bind(this)}>
          logout
        </Button>

        <Query
          query={GET_USERS}
          fetchPolicy='cache-and-network'
          variables={{ id: this.props.graphcool_id }}>
          {result => {
            // console.log('result!', result) // beware, in ios this is the ENTIRE APOLLO CLIENT
            let { data, loading, error, refetch, networkStatus } = result

            console.log(
              'results from token query in Home',
              Object.assign({}, data)
            )

            if (error) {
              console.error('error', error)
              return (
                <View>
                  <Paragraph>{error.message}</Paragraph>
                </View>
              )
            }

            if (!data && loading) {
              return (
                <View>
                  <Paragraph>Loading...</Paragraph>
                </View>
              )
            }

            if (data && data.user && data.user.tokens) {
              return (
                <FlatList
                  data={data.user.tokens}
                  keyExtractor={item => String(item.deviceToken)}
                  renderItem={({ item }) => (
                    <Paragraph>{item.deviceToken}</Paragraph>
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={loading && networkStatus !== POLL_STATUS}
                      onRefresh={refetch}
                    />
                  }
                />
              )
            }

            return (
              <View>
                <Paragraph>Failing silently?</Paragraph>
              </View>
            )
          }}
        </Query>
      </View>
    )
  }

  async logout () {
    console.log('logout')
    await this.props.appLogout()
  }

  onCommitField = (where, e) => {
    const input = where + 'Input'

    this.setState({ [where]: this.state[input], [input]: '' })
  }

  onChangeMetric = metric => {
    if (this.isValidMetric(metric) || metric === '') {
      this.setState({ metric })
    } else if (this.state.metric === '' && this.isValidMetric('0.' + metric)) {
      this.setState({ metric: '0.' + metric })
    }
  }

  onCommitMetric = async () => {
    let path = firebaseConfig.appData.path
    let payload = this.getAppTx({
      uid: this.state.uid,
      app_id: this.state.appid,
      app_name: this.state.appName,
      metric: +this.state.metric
    })

    const db = await Firebase.getDb()

    console.log('db', db)

    db.collection(path + this.state.uid).add(payload)
  }

  /** helper method - generate a valid firebase payload for app metric data
   * TODO - refactor. This is a store executable
   */
  getAppTx = object => {
    object.date = this.getFirebaseDate()
    return object
  }

  /** helper method - generate a valid Date for firebse database
   * from src https://stackoverflow.com/questions/8362952/output-javascript-date-in-yyyy-mm-dd-hhmsec-format#answer-54187918
   * TODO - refactor. This is a store executable
   */
  getFirebaseDate = (date = new Date()) =>
    date
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

  /** helper method that validates state.metric
   * TODO - refactor. This is arguably a store executable
   */
  isValidMetric = (metric = this.state.metric) => {
    const isString = typeof metric === 'string'
    const nonEmpty = isString && metric.length

    const n = +metric

    return isString && nonEmpty && !isNaN(n) && n >= 0 && n <= 1
  }

  /** helper method to toggle button for field submission */
  isFieldValid = field => {
    const input = field + 'Input'
    return typeof this.state[input] === 'string' && this.state[input].length > 0
  }

  /** render helper method - generate field inputs */
  factoryInput = (field, label, appending = null) => {
    const input = field + 'Input'

    return (
      <View>
        <TextInput
          label={label}
          value={this.state[input]}
          onChangeText={item => this.setState({ [input]: item })}
        />

        <Button
          icon='account-box'
          mode='contained'
          dark
          compact
          disabled={!this.isFieldValid(field)}
          onPress={e => this.onCommitField(field, e)}>
          use {label}
        </Button>
        {appending}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  text: {
    marginVertical: 4
  }
})

export default withTheme(Override)
