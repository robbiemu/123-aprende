import { vw } from 'react-native-expo-viewport-units'

const paddedWidth = vw(100) - 32
const pixelRatio = 100 / vw(100)
const videoRatioHeight = 9 / 16

export const videoStyle = {
  alignSelf: 'stretch',
  width: paddedWidth,
  height: vw(paddedWidth * pixelRatio * videoRatioHeight)
}
