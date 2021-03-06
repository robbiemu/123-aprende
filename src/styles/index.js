import { Colors } from 'react-native-paper'

import config from '@src/config/css'

export const spinner = {
  position: config.FIXED,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: Colors.black,
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0.5,
  zIndex: 2
}
