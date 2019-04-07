import { Platform } from 'react-native'
import { DefaultTheme } from 'react-native-paper'

const heading3 =
  Platform.OS === 'ios'
    ? {}
    : {
      flex: 1,
      borderBottomWidth: 1,
      borderColor: DefaultTheme.colors.primary
    }

const heading3Text = Platform.OS === 'ios' ? {} : { textAlign: 'right' }

const heading2 =
  Platform.OS === 'ios'
    ? {}
    : {
      marginTop: 20
    }

const heading2Text = Platform.OS === 'ios' ? {} : {}

export const styles = {
  heading3,
  heading3Text,
  heading2,
  heading2Text
}
