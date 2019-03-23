import React from 'react'
import { View } from 'react-native'
import { Paragraph } from 'react-native-paper'
import Markdown from 'react-native-markdown-renderer'
import AsyncStorage from '@callstack/async-storage'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import config from '@src/config/app'
import { HOME_PAGE_ID } from '@src/lib/constants'

const GET_HOME_PAGE = gql`query page ($id: ID) {
  Page (id: $id) {
    id,
    markdown,
    title,
    type
  }
}`

class Home extends React.Component<Props> {
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
  }

  render () {
    return (<Query
              query={GET_HOME_PAGE}
              fetchPolicy='network-only'
              variables={{ id: HOME_PAGE_ID }}>
            {result => {
              // console.trace('result!', result) // beware, in ios this is the ENTIRE APOLLO CLIENT
              let { data, error } = result

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

              if (data && data.Page && data.Page.markdown) {
                return <Markdown>{data.Page.markdown.replace(/\\n/g, '\n')}</Markdown>
              }

              return (
                  <View>
                    <Paragraph>Failing silently?</Paragraph>
                  </View>
              )
            }}
          </Query>
    )
  }
}

export default Home
