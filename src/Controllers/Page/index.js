import React from 'react'
import { View } from 'react-native'
import { Paragraph } from 'react-native-paper'
import AsyncStorage from '@callstack/async-storage'
import { Query } from 'react-apollo'

import config from '@src/config/app'
import history from '@src/lib/history'
import PageModel from '@src/Models/Page'
import { pageContainerStyle } from '@src/styles/components/page'

import Appbar from '@src/Controllers/Appbar'
import Drawer from '@src/Controllers/Drawer'
import DefaultPage from './Page'
import Home from './Home'
import Lesson from './Lesson'

class Page extends React.Component<Props> {
  state = {
    graphcool_id: null,
    uid: '',
    uidInput: '',
    isShowingDrawer: false
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
            query={PageModel.getPage}
            fetchPolicy='network-only'
            variables={{ id: this.props.id || this.props.match.params.id }}>
          {result => {
            // console.trace('result!', result) // beware, in ios this is the ENTIRE APOLLO CLIENT
            let { data, error } = result

            console.log(
                'results from page query in Home',
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

            if (data && data.Page && data.Page.markdown && data.Page.type) {
              let page
              switch (data.Page.type) {
                case config.constants.pages.types.Lesson:
                  page = <Lesson data={data.Page} />
                  break
                case config.constants.pages.types.Page:
                  if (data.Page.id === config.constants.graphcool.HOME_PAGE_ID) {
                    page = <Home data={data.Page} />
                  } else {
                    page = <DefaultPage data={data.Page} />
                  }
                  break
                default:
                  console.warn('page with unknown type:', data.Page.type)
                  page = <DefaultPage data={data.Page} />
              }

              return (
                  <View>
                    { this.state.isShowingDrawer && <Drawer
                        isShowingDrawer={this.state.isShowingDrawer}
                        toggleDrawer={this.toggleDrawer.bind(this)}
                        data={{ from: Page, context: data.Page }}
                    /> }
                    <View>
                      <Appbar data={data.Page}
                              goBack={this.goBack.bind(this)}
                              toggleDrawer={this.toggleDrawer.bind(this)}
                      />
                      <View style={pageContainerStyle}>{page}</View>
                    </View>
                  </View>
              )
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

  goBack () {
    history.goBack()
  }

  toggleDrawer () {
    this.setState({ isShowingDrawer: !this.state.isShowingDrawer })
  }
}

export default Page
