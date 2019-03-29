import { DefaultTheme } from 'react-native-paper'

import config from '@src/config/css'

export const drawerStyle = {
  position: config.FIXED,
  top: 40,
  bottom: 0,
  left: 0,
  zIndex: 2,
  width: 250,
  padding: 16,
  backgroundColor: DefaultTheme.colors.primary
}

export const drawerItemStyle = {
  backgroundColor: DefaultTheme.colors.accent
}
