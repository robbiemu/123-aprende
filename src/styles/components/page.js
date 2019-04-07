import { Platform } from 'react-native'
import { DefaultTheme } from 'react-native-paper'
import { vh } from 'react-native-expo-viewport-units'

export const pageContainerStyle = {
  backgroundColor: DefaultTheme.colors.background,
  paddingTop: 48,
  paddingBottom: 16,
  paddingHorizontal: 16
}

export const lessonContainerStyle =
  Platform.OS === 'ios'
    ? {}
    : {
      ...pageContainerStyle,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }

export const lessonStyle =
  Platform.OS === 'ios'
    ? {
      backgroundColor: DefaultTheme.colors.background,
      minHeight: vh(100) - 120
    }
    : {
      backgroundColor: DefaultTheme.colors.background,
      maxWidth: '63em', // http://psychology.wichita.edu/surl/usabilitynews/72/LineLength.asp
      minHeight: 'calc(100vh - 120px)'
    }

export const pageStyle =
  Platform.OS === 'ios'
    ? {
      ...lessonStyle
    }
    : {
      ...lessonStyle,
      paddingRight: 16,
      boxShadow: '10px 0px 4px -4px rgba(0,0,0,0.15)',
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4
    }
