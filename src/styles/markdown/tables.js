import { Platform } from 'react-native'
import { DefaultTheme } from 'react-native-paper'

const borderColor = DefaultTheme.colors.surface

const tableRowText = Platform.OS === 'ios' ? {} : { fontWeight: 300 }

const tableHeaderText =
  Platform.OS === 'ios'
    ? {}
    : {
      marginRight: 5,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: DefaultTheme.colors.surface
    }

const tableHeaderCell =
  Platform.OS === 'ios'
    ? {
      flexBasis: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'flex-start',
      padding: 5,
      backgroundColor: DefaultTheme.colors.accent,
      borderRightWidth: 0,
      borderBottomWidth: 2,
      borderColor
    }
    : {
      flexBasis: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: 5,
      backgroundColor: DefaultTheme.colors.accent,
      borderRightWidth: 2,
      borderBottomWidth: 0,
      borderColor
    }

export const styles = {
  table: {
    display: 'flex',
    flexDirection: 'column'
  },
  tableHeaderCell,
  removeCell: {
    height: 0,
    padding: 0,
    visibiliy: 'hidden'
  },
  tableRow: {
    display: 'flex',
    flexDirection: Platform.OS === 'ios' ? 'column' : 'row',
    flex: 1,
    flexBasis: '16.666%',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor
  },
  tableRowCell: {
    flexBasis: '100%',
    flex: 1,
    padding: 5
  },
  tableRowText,
  tableHeaderText
}
