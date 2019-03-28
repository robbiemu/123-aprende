import { DefaultTheme } from 'react-native-paper'

import config from '@src/config/css'

export const drawerStyle = {
  position: config.FIXED,
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 2,
  width: '25%',
  padding: 16,
  background: DefaultTheme.colors.primary
}

export const drawerItemStyle = {
  backgroundColor: DefaultTheme.colors.accent
}
