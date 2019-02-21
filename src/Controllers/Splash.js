import React from 'react'
import { View } from 'react-native'
import {
  Headline,
  Caption,
  withTheme,
  type Theme, Paragraph,
} from 'react-native-paper'

type Props = {
    theme: Theme,
}

class Splash extends React.Component<Props> {    
    render() {
        return (<View>
            <Headline>Third-Party-Demo</Headline>
            <Caption>...splash screen...</Caption>
            <Paragraph>{ this.props.message || '' }</Paragraph>
        </View>)
    }
}

export default withTheme(Splash)
  